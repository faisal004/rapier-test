import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { InstancedRigidBodies, CylinderCollider, BallCollider, CuboidCollider, RigidBody, Physics } from '@react-three/rapier'
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three'
export default function Experience() {
    const cubesCount = 50
    const cubeRef = useRef()
    const twister = useRef()
    const cubeJump = () => {
        cubeRef.current.applyImpulse({ x: 0, y: 5, z: 0 })
        cubeRef.current.applyTorqueImpulse({ x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 })
    }
    const instances = useMemo(() => {
        const instances = []

        for (let i = 0; i < cubesCount; i++) {
            instances.push({
                key: 'instance_' + i,
                position:
                    [
                        (Math.random() - 0.5) * 8,
                        6 + i * 0.2,
                        (Math.random() - 0.5) * 8
                    ],
                rotation: [Math.random(), Math.random(), Math.random()],
            })
        }

        return instances
    }, [])
    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        const eulerRotation = new THREE.Euler(0, time * 10, 0)
        const quaternionRotation = new THREE.Quaternion()
        quaternionRotation.setFromEuler(eulerRotation)
        twister.current.setNextKinematicRotation(quaternionRotation)
        const angle = time * 0.5
        const x = Math.cos(angle) * 2
        const z = Math.sin(angle) * 2
        twister.current.setNextKinematicTranslation({ x: x, y: - 0.8, z: z })
    })
    return <>

        <Perf position="top-right" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
        <ambientLight intensity={1.5} />
        <Physics gravity={[0, -9.8, 0]}>
            <RigidBody colliders="ball">
                <mesh castShadow position={[- 2, 2, 0]}>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>
            <RigidBody
                restitution={0.5}
                ref={cubeRef} position={[2, 2, 0]}>

                <mesh castShadow onClick={cubeJump}>
                    <boxGeometry />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
            </RigidBody>


            <RigidBody type='fixed'>

                <mesh receiveShadow position-y={- 1.25}>
                    <boxGeometry args={[10, 0.5, 10]} />
                    <meshStandardMaterial color="black" />
                </mesh>
            </RigidBody>
            <RigidBody
                ref={twister}
                position={[0, -0.8, 0]}
                friction={0}
                type='kinematicPosition'
            >
                <mesh castShadow scale={[0.8, 0.8, 5]}>
                    <boxGeometry />
                    <meshStandardMaterial color={"red"} />
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
                <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, - 5.5]} />
                <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
                <CuboidCollider args={[0.5, 2, 5]} position={[- 5.5, 1, 0]} />
            </RigidBody>

            <InstancedRigidBodies instances={instances}>
                <instancedMesh castShadow receiveShadow args={[null, null, cubesCount]}>
                    <boxGeometry />
                    <meshStandardMaterial color="greenyellow" />
                </instancedMesh>
            </InstancedRigidBodies>
        </Physics>
    </>
}