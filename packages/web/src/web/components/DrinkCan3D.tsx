import { useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// ─── Spinning Can — shifted right so it aligns with the right panel ──────────
function CanMesh({ textureUrl }: { textureUrl: string }) {
  const groupRef = useRef<THREE.Group>(null!);
  const bodyRef = useRef<THREE.Mesh>(null!);
  const texture = useTexture(textureUrl);

  useEffect(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.needsUpdate = true;
  }, [texture]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Slow ambient spin — 8s per rev (from motion skill: slow spin 10-30s/rev for decoration)
    groupRef.current.rotation.y += delta * (Math.PI * 2) / 9;
    // Disney floating — ±0.1 units, 3s cycle, sine ease-in-out
    groupRef.current.position.y = Math.sin(t * 0.9) * 0.1;
    // Gentle tilt wobble — follow-through principle
    groupRef.current.rotation.z = Math.sin(t * 0.45) * 0.035;
  });

  return (
    <group ref={groupRef} position={[2.2, 0, 0]}>
      {/* Can body */}
      <mesh ref={bodyRef} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 1.8, 80, 1, false]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.75}
          roughness={0.12}
          envMapIntensity={1.8}
        />
      </mesh>
      {/* Top taper */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.44, 0.55, 0.12, 64]} />
        <meshStandardMaterial metalness={0.95} roughness={0.05} color="#d4d4d4" />
      </mesh>
      {/* Lid */}
      <mesh position={[0, 1.02, 0]} castShadow>
        <cylinderGeometry args={[0.44, 0.44, 0.04, 64]} />
        <meshStandardMaterial metalness={0.9} roughness={0.08} color="#cccccc" />
      </mesh>
      {/* Pull tab ring */}
      <mesh position={[0.16, 1.06, 0]} rotation={[0.4, 0, 0.1]} castShadow>
        <torusGeometry args={[0.1, 0.022, 10, 20, Math.PI]} />
        <meshStandardMaterial metalness={0.85} roughness={0.12} color="#bbbbbb" />
      </mesh>
      {/* Bottom taper */}
      <mesh position={[0, -0.92, 0]} castShadow>
        <cylinderGeometry args={[0.50, 0.55, 0.1, 64]} />
        <meshStandardMaterial metalness={0.95} roughness={0.05} color="#c4c4c4" />
      </mesh>
      {/* Bottom lid */}
      <mesh position={[0, -0.98, 0]} castShadow>
        <cylinderGeometry args={[0.50, 0.50, 0.04, 64]} />
        <meshStandardMaterial metalness={0.9} roughness={0.08} color="#c0c0c0" />
      </mesh>
      {/* Can shine streak */}
      <mesh position={[0.3, 0, 0.52]} castShadow>
        <planeGeometry args={[0.06, 1.6]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ─── 3D Fruit / Object ───────────────────────────────────────────────────────
function Fruit3D({ position, color, emissive, scale, floatSpeed, floatOffset, rotSpeed, shape }: any) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    // Layered floating — each element has different freq to prevent sync (motion skill)
    meshRef.current.position.y = position[1] + Math.sin(t * floatSpeed + floatOffset) * 0.2;
    meshRef.current.position.x = position[0] + Math.cos(t * floatSpeed * 0.5 + floatOffset) * 0.07;
    meshRef.current.rotation.y += delta * rotSpeed;
    meshRef.current.rotation.x += delta * rotSpeed * 0.5;
  });

  const geo = () => {
    switch (shape) {
      case "gummy":   return <boxGeometry args={[1.3, 1.6, 0.9, 4, 4, 4]} />;
      case "kiwi":    return <sphereGeometry args={[1, 28, 28]} />;
      case "mango":   return <sphereGeometry args={[1, 28, 28]} />;
      case "orange":  return <sphereGeometry args={[1, 28, 28]} />;
      case "star":    return <octahedronGeometry args={[1, 0]} />;
      case "rocket":  return <coneGeometry args={[0.65, 1.9, 8]} />;
      case "crystal": return <dodecahedronGeometry args={[1, 0]} />;
      case "gem":     return <icosahedronGeometry args={[1, 0]} />;
      default:        return <sphereGeometry args={[1, 28, 28]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={position} scale={scale} castShadow>
      {geo()}
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.3}
        metalness={0.15}
        roughness={0.3}
      />
    </mesh>
  );
}

// ─── Per-flavor config ───────────────────────────────────────────────────────
const SCENES: Record<number, { canTexture: string; ambient: string; point: string; fruits: any[] }> = {
  0: {
    canTexture: "/can-sour-gummy.png",
    ambient: "#FF8C00",
    point: "#FFE135",
    fruits: [
      { position: [-3.5, 0.5, -1.2], color: "#FF6B1A", emissive: "#CC3300", scale: 0.44, floatSpeed: 0.9,  floatOffset: 0,   rotSpeed: 0.8,  shape: "gummy"  },
      { position: [-1.8, 1.6, -0.8], color: "#FFD700", emissive: "#FF8800", scale: 0.32, floatSpeed: 1.1,  floatOffset: 1.2, rotSpeed: -0.6, shape: "gummy"  },
      { position: [-4.0,-1.0,  0.4], color: "#FF4500", emissive: "#CC2000", scale: 0.28, floatSpeed: 0.7,  floatOffset: 2.5, rotSpeed: 1.0,  shape: "orange" },
      { position: [ 0.5,-1.8, -0.6], color: "#FFA500", emissive: "#FF6600", scale: 0.22, floatSpeed: 1.3,  floatOffset: 0.8, rotSpeed: -0.9, shape: "star"   },
      { position: [-4.5, 1.8, -0.5], color: "#FFE135", emissive: "#FFCC00", scale: 0.19, floatSpeed: 0.6,  floatOffset: 1.8, rotSpeed: 0.5,  shape: "crystal"},
      { position: [ 4.2, 0.8,  0.2], color: "#FF6B1A", emissive: "#CC3300", scale: 0.17, floatSpeed: 1.4,  floatOffset: 3.0, rotSpeed: 1.2,  shape: "gem"    },
      { position: [ 4.5,-0.6, -0.8], color: "#FFD700", emissive: "#FF8800", scale: 0.21, floatSpeed: 0.85, floatOffset: 0.4, rotSpeed: -0.7, shape: "gummy"  },
    ],
  },
  1: {
    canTexture: "/can-strawberry-kiwi.png",
    ambient: "#E8175D",
    point: "#FF9EC6",
    fruits: [
      { position: [-3.5, 0.4, -0.9], color: "#FF2060", emissive: "#AA0030", scale: 0.42, floatSpeed: 0.85, floatOffset: 0,   rotSpeed: 0.7,  shape: "kiwi"   },
      { position: [-1.6, 1.7, -0.7], color: "#3D9B3D", emissive: "#1A5C1A", scale: 0.34, floatSpeed: 1.05, floatOffset: 1.3, rotSpeed: -0.8, shape: "kiwi"   },
      { position: [-4.1,-1.1,  0.5], color: "#FF4D7D", emissive: "#CC0040", scale: 0.27, floatSpeed: 0.7,  floatOffset: 2.2, rotSpeed: 0.9,  shape: "kiwi"   },
      { position: [ 0.4,-1.9, -0.5], color: "#FF2D6B", emissive: "#AA0033", scale: 0.21, floatSpeed: 1.2,  floatOffset: 0.9, rotSpeed: -0.6, shape: "star"   },
      { position: [-4.4, 1.9, -0.6], color: "#FFB3D1", emissive: "#FF6699", scale: 0.18, floatSpeed: 0.6,  floatOffset: 1.7, rotSpeed: 0.5,  shape: "crystal"},
      { position: [ 4.3, 0.9,  0.3], color: "#2ECC2E", emissive: "#1A8C1A", scale: 0.16, floatSpeed: 1.3,  floatOffset: 2.8, rotSpeed: 1.1,  shape: "gem"    },
      { position: [ 4.6,-0.7, -0.7], color: "#FF2060", emissive: "#AA0030", scale: 0.2,  floatSpeed: 0.9,  floatOffset: 0.5, rotSpeed: -0.65,shape: "kiwi"   },
    ],
  },
  2: {
    canTexture: "/can-orange-mango.png",
    ambient: "#FF9500",
    point: "#FFF176",
    fruits: [
      { position: [-3.6, 0.5, -0.9], color: "#FFB830", emissive: "#FF8800", scale: 0.46, floatSpeed: 0.8,  floatOffset: 0,   rotSpeed: 0.65, shape: "mango"  },
      { position: [-1.7, 1.8, -0.7], color: "#FF7700", emissive: "#CC4400", scale: 0.36, floatSpeed: 1.0,  floatOffset: 1.1, rotSpeed: -0.7, shape: "orange" },
      { position: [-4.1,-1.0,  0.6], color: "#FFCC00", emissive: "#FF9900", scale: 0.29, floatSpeed: 0.75, floatOffset: 2.4, rotSpeed: 0.85, shape: "mango"  },
      { position: [ 0.5,-1.8, -0.5], color: "#FFA500", emissive: "#FF6600", scale: 0.23, floatSpeed: 1.25, floatOffset: 0.7, rotSpeed: -0.9, shape: "star"   },
      { position: [-4.6, 1.8, -0.5], color: "#FFF176", emissive: "#FFEE00", scale: 0.19, floatSpeed: 0.6,  floatOffset: 1.9, rotSpeed: 0.5,  shape: "crystal"},
      { position: [ 4.3, 0.8,  0.2], color: "#FF7700", emissive: "#CC4400", scale: 0.16, floatSpeed: 1.4,  floatOffset: 3.1, rotSpeed: 1.2,  shape: "gem"    },
      { position: [ 4.5,-0.5, -0.8], color: "#FFB830", emissive: "#FF8800", scale: 0.22, floatSpeed: 0.88, floatOffset: 0.3, rotSpeed: -0.7, shape: "orange" },
    ],
  },
  3: {
    canTexture: "/can-rocket-pop.png",
    ambient: "#1A4DA8",
    point: "#7EC8FF",
    fruits: [
      { position: [-3.5, 0.6, -0.9], color: "#FF3355", emissive: "#AA0022", scale: 0.38, floatSpeed: 1.2,  floatOffset: 0,   rotSpeed: 1.0,  shape: "rocket" },
      { position: [-1.8, 1.7, -0.8], color: "#4D9FFF", emissive: "#0055CC", scale: 0.35, floatSpeed: 0.9,  floatOffset: 1.4, rotSpeed: -0.8, shape: "rocket" },
      { position: [-4.0,-1.0,  0.5], color: "#FFFFFF", emissive: "#AADDFF", scale: 0.26, floatSpeed: 0.7,  floatOffset: 2.1, rotSpeed: 0.7,  shape: "star"   },
      { position: [ 0.4,-1.9, -0.5], color: "#FF4466", emissive: "#CC0033", scale: 0.2,  floatSpeed: 1.3,  floatOffset: 0.8, rotSpeed: -1.0, shape: "star"   },
      { position: [-4.5, 1.9, -0.6], color: "#7EC8FF", emissive: "#3388CC", scale: 0.18, floatSpeed: 0.6,  floatOffset: 1.6, rotSpeed: 0.5,  shape: "crystal"},
      { position: [ 4.3, 0.9,  0.2], color: "#FF3355", emissive: "#AA0022", scale: 0.16, floatSpeed: 1.5,  floatOffset: 2.9, rotSpeed: 1.3,  shape: "gem"    },
      { position: [ 4.6,-0.6, -0.7], color: "#4D9FFF", emissive: "#0055CC", scale: 0.21, floatSpeed: 0.95, floatOffset: 0.6, rotSpeed: -0.85,shape: "rocket" },
    ],
  },
};

// ─── Scene ───────────────────────────────────────────────────────────────────
function Scene({ flavorIdx }: { flavorIdx: number }) {
  const cfg = SCENES[flavorIdx];
  const { camera } = useThree();

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = 55;
    cam.position.set(0, 0, 7);
    cam.updateProjectionMatrix();
  }, []);

  // Gentle mouse-driven camera drift
  useFrame((state) => {
    camera.position.x += (state.mouse.x * 0.5 - camera.position.x) * 0.04;
    camera.position.y += (state.mouse.y * 0.25 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight color={cfg.ambient} intensity={0.55} />
      <pointLight position={[5, 5, 5]}   color={cfg.point}   intensity={90}  castShadow />
      <pointLight position={[-5, -3, 4]} color={cfg.ambient} intensity={55} />
      <pointLight position={[0, -5, 3]}  color="#ffffff"     intensity={35} />
      <spotLight  position={[1, 7, 4]} angle={0.25} penumbra={0.9} intensity={70} castShadow color="#ffffff" />

      <CanMesh textureUrl={cfg.canTexture} />

      {cfg.fruits.map((f, i) => (
        <Fruit3D key={`${flavorIdx}-${i}`} {...f} />
      ))}
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function DrinkCan3D({ flavorIdx }: { flavorIdx: number }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{
        background: "transparent",
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <Scene flavorIdx={flavorIdx} />
    </Canvas>
  );
}
