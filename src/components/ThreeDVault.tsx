import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SavingsGoal } from '../types';
import { formatINR } from '../utils/formatters';
import { Box, Layers, Eye, Sparkles, Sliders, ChevronUp, ChevronDown } from 'lucide-react';

interface ThreeDVaultProps {
  goals: SavingsGoal[];
}

export const ThreeDVault: React.FC<ThreeDVaultProps> = ({ goals }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isControlsExpanded, setIsControlsExpanded] = useState(true);
  const [selectedGoalIndex, setSelectedGoalIndex] = useState(0);
  const [materialFinish, setMaterialFinish] = useState<'gold' | 'steel' | 'roseGold'>('gold');

  const activeGoal = goals[selectedGoalIndex] || goals[0] || {
    name: 'General Savings Vault',
    targetAmount: 100000,
    savedAmount: 50000,
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    scene.fog = new THREE.FogExp2(0x0f172a, 0.035);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3.5, 9);
    camera.lookAt(0, 0, 0);

    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = !isHeadless;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 1.2);
    scene.add(fillLight);

    // 3. Composite 3D Vault / Piggy Bank Model (THREE.Group)
    const vaultGroup = new THREE.Group();
    scene.add(vaultGroup);

    // Material definitions based on finish selector
    let metalColor = 0xd97706; // Gold
    let roughnessVal = 0.15;
    let metalnessVal = 0.95;

    if (materialFinish === 'steel') {
      metalColor = 0x64748b;
      roughnessVal = 0.2;
      metalnessVal = 0.9;
    } else if (materialFinish === 'roseGold') {
      metalColor = 0xe11d48;
      roughnessVal = 0.18;
      metalnessVal = 0.92;
    }

    const vaultMaterial = new THREE.MeshPhysicalMaterial({
      color: metalColor,
      metalness: metalnessVal,
      roughness: roughnessVal,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      anisotropy: 0.8,
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.3,
    });

    // Vault Body (Main Cylinder / Chest)
    const bodyGeo = new THREE.CylinderGeometry(1.8, 1.6, 2.2, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, vaultMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    bodyMesh.position.y = 1.1;
    vaultGroup.add(bodyMesh);

    // Vault Cap / Dome Top
    const capGeo = new THREE.SphereGeometry(1.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const capMesh = new THREE.Mesh(capGeo, vaultMaterial);
    capMesh.position.y = 2.2;
    capMesh.castShadow = true;
    vaultGroup.add(capMesh);

    // Vault Base Ring
    const baseGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.2, 32);
    const baseMesh = new THREE.Mesh(baseGeo, accentMaterial);
    baseMesh.position.y = 0.1;
    vaultGroup.add(baseMesh);

    // Coin Slot on Top
    const slotGeo = new THREE.BoxGeometry(0.8, 0.08, 0.2);
    const slotMesh = new THREE.Mesh(slotGeo, accentMaterial);
    slotMesh.position.set(0, 3.01, 0);
    vaultGroup.add(slotMesh);

    // Glowing Progress Ring / Core representing savings progress
    const progressRatio = Math.min(1, (activeGoal.savedAmount || 0) / (activeGoal.targetAmount || 100000));
    const ringGeo = new THREE.TorusGeometry(1.92, 0.06, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: progressRatio >= 1 ? 0x10b981 : 0x6366f1,
      emissive: progressRatio >= 1 ? 0x059669 : 0x4f46e5,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 1.2 * progressRatio + 0.3;
    vaultGroup.add(ringMesh);

    // Ground Contact Shadow plane
    const shadowGeo = new THREE.PlaneGeometry(5, 5);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.01;
    scene.add(shadowMesh);

    // 4. Animation loop with smooth rotation & floating
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      vaultGroup.rotation.y += delta * 0.4;

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeGoal, materialFinish]);

  const progress = activeGoal.targetAmount > 0 
    ? Math.min(100, Math.round((activeGoal.savedAmount / activeGoal.targetAmount) * 100)) 
    : 0;

  return (
    <div className="relative w-full h-[calc(100vh-80vh-4rem)] min-h-[580px] bg-slate-950 overflow-hidden flex flex-col">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Top Overlay Spec Badge */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 text-white px-4 py-2 rounded-xl flex items-center gap-3 shadow-xl pointer-events-auto">
          <Box className="w-5 h-5 text-purple-400" />
          <div>
            <div className="text-sm font-bold">{activeGoal.name}</div>
            <div className="text-xs text-slate-400 font-mono">
              Saved {formatINR(activeGoal.savedAmount)} / Target {formatINR(activeGoal.targetAmount)} ({progress}%)
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Unified Control Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[840px] pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-2xl p-4 text-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>Interactive 3D Savings Vault</span>
            </div>
            <button
              onClick={() => setIsControlsExpanded(!isControlsExpanded)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>{isControlsExpanded ? 'Hide Controls' : 'Show Controls'}</span>
              {isControlsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>

          {isControlsExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Select Goal */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Select Goal to Inspect</label>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {goals.map((g, idx) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGoalIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                        selectedGoalIndex === idx
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Finish Swatches */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Vault Material Finish</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMaterialFinish('gold')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      materialFinish === 'gold' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Polished Gold
                  </button>
                  <button
                    onClick={() => setMaterialFinish('steel')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      materialFinish === 'steel' ? 'bg-slate-300 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Brushed Steel
                  </button>
                  <button
                    onClick={() => setMaterialFinish('roseGold')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      materialFinish === 'roseGold' ? 'bg-rose-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Rose Gold
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
