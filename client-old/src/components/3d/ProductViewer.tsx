import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';

interface ProductViewerProps {
  modelUrl: string;
}

const Model = ({ url }: { url: string }) => {
  // Configured with Draco Loader for compressed GLB files
  const { scene } = useGLTF(url, 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
  return <primitive object={scene} />;
};

export const ProductViewer: React.FC<ProductViewerProps> = ({ modelUrl }) => {
  return (
    <div className="w-full h-[500px] bg-slate-50 rounded-xl shadow-md overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Suspense fallback={null}>
          <Model url={modelUrl} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls autoRotate enablePan={false} enableZoom={true} />
      </Canvas>
    </div>
  );
};
