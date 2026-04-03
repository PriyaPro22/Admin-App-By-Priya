"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

interface NeuralBackgroundProps {
    isDark: boolean;
}

const NeuralBackground: React.FC<NeuralBackgroundProps> = ({ isDark }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [paused, setPaused] = useState(false);
    const [currentFormation, setCurrentFormation] = useState(0);
    const [activePaletteIndex, setActivePaletteIndex] = useState(isDark ? 0 : 2);
    const [densityFactor, setDensityFactor] = useState(1);

    // Refs for Three.js objects to access them across effects/events
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const composerRef = useRef<EffectComposer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const nodesMeshRef = useRef<THREE.Points | null>(null);
    const connectionsMeshRef = useRef<THREE.LineSegments | null>(null);
    const starFieldRef = useRef<THREE.Points | null>(null);
    const clockRef = useRef(new THREE.Clock());
    const configRef = useRef({
        paused: false,
        activePaletteIndex: isDark ? 0 : 2,
        currentFormation: 0,
        numFormations: 3,
        densityFactor: 1
    });

    const colorPalettes = [
        [
            new THREE.Color(0x667eea),
            new THREE.Color(0x764ba2),
            new THREE.Color(0xf093fb),
            new THREE.Color(0x9d50bb),
            new THREE.Color(0x6e48aa)
        ],
        [
            new THREE.Color(0xf857a6),
            new THREE.Color(0xff5858),
            new THREE.Color(0xfeca57),
            new THREE.Color(0xff6348),
            new THREE.Color(0xff9068)
        ],
        [
            new THREE.Color(0x4facfe),
            new THREE.Color(0x00f2fe),
            new THREE.Color(0x43e97b),
            new THREE.Color(0x38f9d7),
            new THREE.Color(0x4484ce)
        ]
    ];

    const pulseUniforms = useRef({
        uTime: { value: 0.0 },
        uPulsePositions: {
            value: [
                new THREE.Vector3(1e3, 1e3, 1e3),
                new THREE.Vector3(1e3, 1e3, 1e3),
                new THREE.Vector3(1e3, 1e3, 1e3)
            ]
        },
        uPulseTimes: { value: [-1e3, -1e3, -1e3] },
        uPulseColors: {
            value: [
                new THREE.Color(1, 1, 1),
                new THREE.Color(1, 1, 1),
                new THREE.Color(1, 1, 1)
            ]
        },
        uPulseSpeed: { value: 18.0 },
        uBaseNodeSize: { value: 0.6 }
    });

    const noiseFunctions = `
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        
        i = mod289(i);
        vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        
        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        
        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
        
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }`;

    const nodeShader = {
        vertexShader: `${noiseFunctions}
        attribute float nodeSize;
        attribute float nodeType;
        attribute vec3 nodeColor;
        attribute float distanceFromRoot;
        
        uniform float uTime;
        uniform vec3 uPulsePositions[3];
        uniform float uPulseTimes[3];
        uniform float uPulseSpeed;
        uniform float uBaseNodeSize;
        
        varying vec3 vColor;
        varying float vNodeType;
        varying vec3 vPosition;
        varying float vPulseIntensity;
        varying float vDistanceFromRoot;
        varying float vGlow;
        float getPulseIntensity(vec3 worldPos, vec3 pulsePos, float pulseTime) {
            if (pulseTime < 0.0) return 0.0;
            float timeSinceClick = uTime - pulseTime;
            if (timeSinceClick < 0.0 || timeSinceClick > 4.0) return 0.0;
            float pulseRadius = timeSinceClick * uPulseSpeed;
            float distToClick = distance(worldPos, pulsePos);
            float pulseThickness = 3.0;
            float waveProximity = abs(distToClick - pulseRadius);
            return smoothstep(pulseThickness, 0.0, waveProximity) * smoothstep(4.0, 0.0, timeSinceClick);
        }
        void main() {
            vNodeType = nodeType;
            vColor = nodeColor;
            vDistanceFromRoot = distanceFromRoot;
            vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
            vPosition = worldPos;
            float totalPulseIntensity = 0.0;
            for (int i = 0; i < 3; i++) {
                totalPulseIntensity += getPulseIntensity(worldPos, uPulsePositions[i], uPulseTimes[i]);
            }
            vPulseIntensity = min(totalPulseIntensity, 1.0);
            float breathe = sin(uTime * 0.7 + distanceFromRoot * 0.15) * 0.15 + 0.85;
            float baseSize = nodeSize * breathe;
            float pulseSize = baseSize * (1.0 + vPulseIntensity * 2.5);
            vGlow = 0.5 + 0.5 * sin(uTime * 0.5 + distanceFromRoot * 0.2);
            vec3 modifiedPosition = position;
            if (nodeType > 0.5) {
                float noise = snoise(position * 0.08 + uTime * 0.08);
                modifiedPosition += normal * noise * 0.15;
            }
            vec4 mvPosition = modelViewMatrix * vec4(modifiedPosition, 1.0);
            gl_PointSize = pulseSize * uBaseNodeSize * (1000.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }`,
        fragmentShader: `
        uniform float uTime;
        uniform vec3 uPulseColors[3];
        uniform vec3 cameraPosition;
        
        varying vec3 vColor;
        varying float vNodeType;
        varying vec3 vPosition;
        varying float vPulseIntensity;
        varying float vDistanceFromRoot;
        varying float vGlow;
        void main() {
            vec2 center = 2.0 * gl_PointCoord - 1.0;
            float dist = length(center);
            if (dist > 1.0) discard;
            float glow1 = 1.0 - smoothstep(0.0, 0.5, dist);
            float glow2 = 1.0 - smoothstep(0.0, 1.0, dist);
            float glowStrength = pow(glow1, 1.2) + glow2 * 0.3;
            float breatheColor = 0.9 + 0.1 * sin(uTime * 0.6 + vDistanceFromRoot * 0.25);
            vec3 baseColor = vColor * breatheColor;
            vec3 finalColor = baseColor;
            if (vPulseIntensity > 0.0) {
                vec3 pulseColor = mix(vec3(1.0), uPulseColors[0], 0.4);
                finalColor = mix(baseColor, pulseColor, vPulseIntensity * 0.8);
                finalColor *= (1.0 + vPulseIntensity * 1.2);
                glowStrength *= (1.0 + vPulseIntensity);
            }
            float coreBrightness = smoothstep(0.4, 0.0, dist);
            finalColor += vec3(1.0) * coreBrightness * 0.3;
            float alpha = glowStrength * (0.95 - 0.3 * dist);
            float camDistance = length(vPosition - cameraPosition);
            float distanceFade = smoothstep(100.0, 15.0, camDistance);
            if (vNodeType > 0.5) {
                finalColor *= 1.1;
                alpha *= 0.9;
            }
            finalColor *= (1.0 + vGlow * 0.1);
            gl_FragColor = vec4(finalColor, alpha * distanceFade);
        }`
    };

    const connectionShader = {
        vertexShader: `${noiseFunctions}
        attribute vec3 startPoint;
        attribute vec3 endPoint;
        attribute float connectionStrength;
        attribute float pathIndex;
        attribute vec3 connectionColor;
        
        uniform float uTime;
        uniform vec3 uPulsePositions[3];
        uniform float uPulseTimes[3];
        uniform float uPulseSpeed;
        
        varying vec3 vColor;
        varying float vConnectionStrength;
        varying float vPulseIntensity;
        varying float vPathPosition;
        varying float vDistanceFromCamera;

        float getPulseIntensity(vec3 worldPos, vec3 pulsePos, float pulseTime) {
            if (pulseTime < 0.0) return 0.0;
            float timeSinceClick = uTime - pulseTime;
            if (timeSinceClick < 0.0 || timeSinceClick > 4.0) return 0.0;
            
            float pulseRadius = timeSinceClick * uPulseSpeed;
            float distToClick = distance(worldPos, pulsePos);
            float pulseThickness = 3.0;
            float waveProximity = abs(distToClick - pulseRadius);
            
            return smoothstep(pulseThickness, 0.0, waveProximity) * smoothstep(4.0, 0.0, timeSinceClick);
        }
        void main() {
            float t = position.x;
            vPathPosition = t;
            vec3 midPoint = mix(startPoint, endPoint, 0.5);
            float pathOffset = sin(t * 3.14159) * 0.15;
            vec3 perpendicular = normalize(cross(normalize(endPoint - startPoint), vec3(0.0, 1.0, 0.0)));
            if (length(perpendicular) < 0.1) perpendicular = vec3(1.0, 0.0, 0.0);
            midPoint += perpendicular * pathOffset;
            vec3 p0 = mix(startPoint, midPoint, t);
            vec3 p1 = mix(midPoint, endPoint, t);
            vec3 finalPos = mix(p0, p1, t);
            float noiseTime = uTime * 0.15;
            float noise = snoise(vec3(pathIndex * 0.08, t * 0.6, noiseTime));
            finalPos += perpendicular * noise * 0.12;
            vec3 worldPos = (modelMatrix * vec4(finalPos, 1.0)).xyz;
            float totalPulseIntensity = 0.0;
            for (int i = 0; i < 3; i++) {
                totalPulseIntensity += getPulseIntensity(worldPos, uPulsePositions[i], uPulseTimes[i]);
            }
            vPulseIntensity = min(totalPulseIntensity, 1.0);
            vColor = connectionColor;
            vConnectionStrength = connectionStrength;
            
            vDistanceFromCamera = length(worldPos - cameraPosition);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
        }`,
        fragmentShader: `
        uniform float uTime;
        uniform vec3 uPulseColors[3];
        
        varying vec3 vColor;
        varying float vConnectionStrength;
        varying float vPulseIntensity;
        varying float vPathPosition;
        varying float vDistanceFromCamera;
        void main() {
            float flowPattern1 = sin(vPathPosition * 25.0 - uTime * 4.0) * 0.5 + 0.5;
            float flowPattern2 = sin(vPathPosition * 15.0 - uTime * 2.5 + 1.57) * 0.5 + 0.5;
            float combinedFlow = (flowPattern1 + flowPattern2 * 0.5) / 1.5;
            
            vec3 baseColor = vColor * (0.8 + 0.2 * sin(uTime * 0.6 + vPathPosition * 12.0));
            float flowIntensity = 0.4 * combinedFlow * vConnectionStrength;
            vec3 finalColor = baseColor;
            if (vPulseIntensity > 0.0) {
                vec3 pulseColor = mix(vec3(1.0), uPulseColors[0], 0.3);
                finalColor = mix(baseColor, pulseColor * 1.2, vPulseIntensity * 0.7);
                flowIntensity += vPulseIntensity * 0.8;
            }
            finalColor *= (0.7 + flowIntensity + vConnectionStrength * 0.5);
            float baseAlpha = 0.7 * vConnectionStrength;
            float flowAlpha = combinedFlow * 0.3;
            float alpha = baseAlpha + flowAlpha;
            alpha = mix(alpha, min(1.0, alpha * 2.5), vPulseIntensity);
            float distanceFade = smoothstep(100.0, 15.0, vDistanceFromCamera);
            gl_FragColor = vec4(finalColor, alpha * distanceFade);
        }`
    };

    class Node {
        position: THREE.Vector3;
        connections: { node: Node; strength: number }[];
        level: number;
        type: number;
        size: number;
        distanceFromRoot: number;
        helixIndex?: number;
        helixT?: number;

        constructor(position: THREE.Vector3, level = 0, type = 0) {
            this.position = position;
            this.connections = [];
            this.level = level;
            this.type = type;
            this.size = type === 0 ? THREE.MathUtils.randFloat(0.8, 1.4) : THREE.MathUtils.randFloat(0.5, 1.0);
            this.distanceFromRoot = 0;
        }
        addConnection(node: Node, strength = 1.0) {
            if (!this.isConnectedTo(node)) {
                this.connections.push({ node, strength });
                node.connections.push({ node: this, strength });
            }
        }
        isConnectedTo(node: Node) {
            return this.connections.some(conn => conn.node === node);
        }
    }

    const generateNeuralNetwork = (formationIndex: number, densityFactor = 1.0) => {
        let nodes: Node[] = [];
        let rootNode: Node | null = null;

        function generateCrystallineSphere() {
            rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0);
            rootNode.size = 2.0;
            nodes.push(rootNode);
            const layers = 5;
            const goldenRatio = (1 + Math.sqrt(5)) / 2;
            for (let layer = 1; layer <= layers; layer++) {
                const radius = layer * 4;
                const numPoints = Math.floor(layer * 12 * densityFactor);
                for (let i = 0; i < numPoints; i++) {
                    const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);
                    const theta = 2 * Math.PI * i / goldenRatio;
                    const pos = new THREE.Vector3(
                        radius * Math.sin(phi) * Math.cos(theta),
                        radius * Math.sin(phi) * Math.sin(theta),
                        radius * Math.cos(phi)
                    );
                    const isLeaf = layer === layers || Math.random() < 0.3;
                    const node = new Node(pos, layer, isLeaf ? 1 : 0);
                    node.distanceFromRoot = radius;
                    nodes.push(node);
                    if (layer > 1) {
                        const prevLayerNodes = nodes.filter(n => n.level === layer - 1 && n !== rootNode);
                        prevLayerNodes.sort((a, b) =>
                            pos.distanceTo(a.position) - pos.distanceTo(b.position)
                        );
                        for (let j = 0; j < Math.min(3, prevLayerNodes.length); j++) {
                            const dist = pos.distanceTo(prevLayerNodes[j].position);
                            const strength = 1.0 - (dist / (radius * 2));
                            node.addConnection(prevLayerNodes[j], Math.max(0.3, strength));
                        }
                    } else {
                        rootNode?.addConnection(node, 0.9);
                    }
                }
                const layerNodes = nodes.filter(n => n.level === layer && n !== rootNode);
                for (let i = 0; i < layerNodes.length; i++) {
                    const node = layerNodes[i];
                    const nearby = layerNodes.filter(n => n !== node)
                        .sort((a, b) =>
                            node.position.distanceTo(a.position) - node.position.distanceTo(b.position)
                        ).slice(0, 5);
                    for (const nearNode of nearby) {
                        const dist = node.position.distanceTo(nearNode.position);
                        if (dist < radius * 0.8 && !node.isConnectedTo(nearNode)) {
                            node.addConnection(nearNode, 0.6);
                        }
                    }
                }
            }
        }

        function generateHelixLattice() {
            rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0);
            rootNode.size = 1.8;
            nodes.push(rootNode);
            const numHelices = 4;
            const height = 30;
            const maxRadius = 12;
            const nodesPerHelix = Math.floor(50 * densityFactor);
            const helixArrays: Node[][] = [];
            for (let h = 0; h < numHelices; h++) {
                const helixPhase = (h / numHelices) * Math.PI * 2;
                const helixNodes: Node[] = [];
                for (let i = 0; i < nodesPerHelix; i++) {
                    const t = i / (nodesPerHelix - 1);
                    const y = (t - 0.5) * height;
                    const radiusScale = Math.sin(t * Math.PI) * 0.7 + 0.3;
                    const radius = maxRadius * radiusScale;
                    const angle = helixPhase + t * Math.PI * 6;
                    const pos = new THREE.Vector3(
                        radius * Math.cos(angle),
                        y,
                        radius * Math.sin(angle)
                    );
                    const level = Math.ceil(t * 5);
                    const isLeaf = i > nodesPerHelix - 5 || Math.random() < 0.25;
                    const node = new Node(pos, level, isLeaf ? 1 : 0);
                    node.distanceFromRoot = Math.sqrt(radius * radius + y * y);
                    node.helixIndex = h;
                    node.helixT = t;
                    nodes.push(node);
                    helixNodes.push(node);
                }
                helixArrays.push(helixNodes);
                rootNode.addConnection(helixNodes[0], 1.0);
                for (let i = 0; i < helixNodes.length - 1; i++) {
                    helixNodes[i].addConnection(helixNodes[i + 1], 0.85);
                }
            }
            for (let h = 0; h < numHelices; h++) {
                const currentHelix = helixArrays[h];
                const nextHelix = helixArrays[(h + 1) % numHelices];
                for (let i = 0; i < currentHelix.length; i += 5) {
                    const t = currentHelix[i].helixT!;
                    const targetIdx = Math.round(t * (nextHelix.length - 1));
                    if (targetIdx < nextHelix.length) {
                        currentHelix[i].addConnection(nextHelix[targetIdx], 0.7);
                    }
                }
            }
        }

        function generateFractalWeb() {
            rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0);
            rootNode.size = 1.6;
            nodes.push(rootNode);
            const branches = 6;
            const maxDepth = 4;
            function createBranch(startNode: Node, direction: THREE.Vector3, depth: number, strength: number, scale: number) {
                if (depth > maxDepth) return;
                const branchLength = 5 * scale;
                const endPos = new THREE.Vector3()
                    .copy(startNode.position)
                    .add(direction.clone().multiplyScalar(branchLength));
                const isLeaf = depth === maxDepth || Math.random() < 0.3;
                const newNode = new Node(endPos, depth, isLeaf ? 1 : 0);
                if (rootNode) newNode.distanceFromRoot = rootNode.position.distanceTo(endPos);
                nodes.push(newNode);
                startNode.addConnection(newNode, strength);
                if (depth < maxDepth) {
                    const subBranches = 3;
                    for (let i = 0; i < subBranches; i++) {
                        const angle = (i / subBranches) * Math.PI * 2;
                        const perpDir1 = new THREE.Vector3(-direction.y, direction.x, 0).normalize();
                        const perpDir2 = direction.clone().cross(perpDir1).normalize();
                        const newDir = new THREE.Vector3()
                            .copy(direction)
                            .add(perpDir1.clone().multiplyScalar(Math.cos(angle) * 0.7))
                            .add(perpDir2.clone().multiplyScalar(Math.sin(angle) * 0.7))
                            .normalize();
                        createBranch(newNode, newDir, depth + 1, strength * 0.7, scale * 0.75);
                    }
                }
            }
            for (let i = 0; i < branches; i++) {
                const phi = Math.acos(1 - 2 * (i + 0.5) / branches);
                const theta = Math.PI * (1 + Math.sqrt(5)) * i;
                const direction = new THREE.Vector3(
                    Math.sin(phi) * Math.cos(theta),
                    Math.sin(phi) * Math.sin(theta),
                    Math.cos(phi)
                ).normalize();
                if (rootNode) createBranch(rootNode, direction, 1, 0.9, 1.0);
            }
        }

        switch (formationIndex % 3) {
            case 0: generateCrystallineSphere(); break;
            case 1: generateHelixLattice(); break;
            case 2: generateFractalWeb(); break;
        }

        return { nodes, rootNode };
    };

    const updateTheme = useCallback((paletteIndex: number) => {
        if (!nodesMeshRef.current || !connectionsMeshRef.current || !configRef.current) return;
        
        const palette = colorPalettes[paletteIndex];
        const nodeColorsAttr = nodesMeshRef.current.geometry.attributes.nodeColor;
        
        // This part requires nodes array which we need to persist or regenererate carefully
        // For simplicity during theme toggle, we'll just update the uniforms colors
        palette.forEach((color, i) => {
            if (i < 3) {
                if (nodesMeshRef.current) (nodesMeshRef.current.material as THREE.ShaderMaterial).uniforms.uPulseColors.value[i].copy(color);
                if (connectionsMeshRef.current) (connectionsMeshRef.current.material as THREE.ShaderMaterial).uniforms.uPulseColors.value[i].copy(color);
            }
        });
        
        // Full color re-mapping requires the full nodes data
    }, []);

    useEffect(() => {
        const paletteIdx = isDark ? 0 : 2;
        setActivePaletteIndex(paletteIdx);
        configRef.current.activePaletteIndex = paletteIdx;
        updateTheme(paletteIdx);
    }, [isDark, updateTheme]);

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.fog = new THREE.FogExp2(0x000000, 0.002);

        const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 8, 28);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            powerPreference: "high-performance",
            alpha: true
        });
        rendererRef.current = renderer;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0); // Transparent if needed, but the original used black
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        const createStarfield = () => {
            const count = 8000;
            const positions: number[] = [];
            const colors: number[] = [];
            const sizes: number[] = [];
            for (let i = 0; i < count; i++) {
                const r = THREE.MathUtils.randFloat(50, 150);
                const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
                const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
                positions.push(
                    r * Math.sin(phi) * Math.cos(theta),
                    r * Math.sin(phi) * Math.sin(theta),
                    r * Math.cos(phi)
                );
                const colorChoice = Math.random();
                if (colorChoice < 0.7) colors.push(1, 1, 1);
                else if (colorChoice < 0.85) colors.push(0.7, 0.8, 1);
                else colors.push(1, 0.9, 0.8);
                sizes.push(THREE.MathUtils.randFloat(0.1, 0.3));
            }
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
            const mat = new THREE.ShaderMaterial({
                uniforms: { uTime: { value: 0 } },
                vertexShader: `
                    attribute float size;
                    attribute vec3 color;
                    varying vec3 vColor;
                    uniform float uTime;
                    void main() {
                        vColor = color;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        float twinkle = sin(uTime * 2.0 + position.x * 100.0) * 0.3 + 0.7;
                        gl_PointSize = size * twinkle * (300.0 / -mvPosition.z);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    varying vec3 vColor;
                    void main() {
                        vec2 center = gl_PointCoord - 0.5;
                        float dist = length(center);
                        if (dist > 0.5) discard;
                        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                        gl_FragColor = vec4(vColor, alpha * 0.8);
                    }
                `,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });
            return new THREE.Points(geo, mat);
        };

        const starField = createStarfield();
        starFieldRef.current = starField;
        scene.add(starField);

        const controls = new OrbitControls(camera, renderer.domElement);
        controlsRef.current = controls;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.6;
        controls.minDistance = 8;
        controls.maxDistance = 80;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.2;
        controls.enablePan = false;

        const composer = new EffectComposer(renderer);
        composerRef.current = composer;
        composer.addPass(new RenderPass(scene, camera));
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.8,
            0.6,
            0.7
        );
        composer.addPass(bloomPass);
        composer.addPass(new OutputPass());

        const createNetworkVisualization = (formationIndex: number, densityFactor = 1.0) => {
            if (nodesMeshRef.current) {
                scene.remove(nodesMeshRef.current);
                nodesMeshRef.current.geometry.dispose();
                (nodesMeshRef.current.material as THREE.ShaderMaterial).dispose();
            }
            if (connectionsMeshRef.current) {
                scene.remove(connectionsMeshRef.current);
                connectionsMeshRef.current.geometry.dispose();
                (connectionsMeshRef.current.material as THREE.ShaderMaterial).dispose();
            }

            const network = generateNeuralNetwork(formationIndex, densityFactor);
            const palette = colorPalettes[configRef.current.activePaletteIndex];

            // Nodes
            const nodesGeometry = new THREE.BufferGeometry();
            const nodePositions: number[] = [];
            const nodeTypes: number[] = [];
            const nodeSizes: number[] = [];
            const nodeColors: number[] = [];
            const distancesFromRoot: number[] = [];

            network.nodes.forEach((node) => {
                nodePositions.push(node.position.x, node.position.y, node.position.z);
                nodeTypes.push(node.type);
                nodeSizes.push(node.size);
                distancesFromRoot.push(node.distanceFromRoot);
                const colorIndex = Math.min(node.level, palette.length - 1);
                const baseColor = palette[colorIndex % palette.length].clone();
                baseColor.offsetHSL(
                    THREE.MathUtils.randFloatSpread(0.03),
                    THREE.MathUtils.randFloatSpread(0.08),
                    THREE.MathUtils.randFloatSpread(0.08)
                );
                nodeColors.push(baseColor.r, baseColor.g, baseColor.b);
            });

            nodesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));
            nodesGeometry.setAttribute('nodeType', new THREE.Float32BufferAttribute(nodeTypes, 1));
            nodesGeometry.setAttribute('nodeSize', new THREE.Float32BufferAttribute(nodeSizes, 1));
            nodesGeometry.setAttribute('nodeColor', new THREE.Float32BufferAttribute(nodeColors, 3));
            nodesGeometry.setAttribute('distanceFromRoot', new THREE.Float32BufferAttribute(distancesFromRoot, 1));

            const nodesMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    ...THREE.UniformsUtils.clone(pulseUniforms.current),
                    cameraPosition: { value: camera.position }
                },
                vertexShader: nodeShader.vertexShader,
                fragmentShader: nodeShader.fragmentShader,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });
            const nodesMesh = new THREE.Points(nodesGeometry, nodesMaterial);
            nodesMeshRef.current = nodesMesh;
            scene.add(nodesMesh);

            // Connections
            const connectionsGeometry = new THREE.BufferGeometry();
            const connectionColors: number[] = [];
            const connectionStrengths: number[] = [];
            const connectionPositions: number[] = [];
            const startPoints: number[] = [];
            const endPoints: number[] = [];
            const pathIndices: number[] = [];
            const processedConnections = new Set();
            let pIdx = 0;

            network.nodes.forEach((node, nodeIndex) => {
                node.connections.forEach(connection => {
                    const connectedNode = connection.node;
                    const connectedIndex = network.nodes.indexOf(connectedNode);
                    if (connectedIndex === -1) return;
                    const key = [Math.min(nodeIndex, connectedIndex), Math.max(nodeIndex, connectedIndex)].join('-');
                    if (!processedConnections.has(key)) {
                        processedConnections.add(key);
                        const numSegments = 20;
                        for (let i = 0; i < numSegments; i++) {
                            const t = i / (numSegments - 1);
                            connectionPositions.push(t, 0, 0);
                            startPoints.push(node.position.x, node.position.y, node.position.z);
                            endPoints.push(connectedNode.position.x, connectedNode.position.y, connectedNode.position.z);
                            pathIndices.push(pIdx);
                            connectionStrengths.push(connection.strength);
                            const avgLevel = Math.min(Math.floor((node.level + connectedNode.level) / 2), palette.length - 1);
                            const baseColor = palette[avgLevel % palette.length].clone();
                            baseColor.offsetHSL(
                                THREE.MathUtils.randFloatSpread(0.03),
                                THREE.MathUtils.randFloatSpread(0.08),
                                THREE.MathUtils.randFloatSpread(0.08)
                            );
                            connectionColors.push(baseColor.r, baseColor.g, baseColor.b);
                        }
                        pIdx++;
                    }
                });
            });

            connectionsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionPositions, 3));
            connectionsGeometry.setAttribute('startPoint', new THREE.Float32BufferAttribute(startPoints, 3));
            connectionsGeometry.setAttribute('endPoint', new THREE.Float32BufferAttribute(endPoints, 3));
            connectionsGeometry.setAttribute('connectionStrength', new THREE.Float32BufferAttribute(connectionStrengths, 1));
            connectionsGeometry.setAttribute('connectionColor', new THREE.Float32BufferAttribute(connectionColors, 3));
            connectionsGeometry.setAttribute('pathIndex', new THREE.Float32BufferAttribute(pathIndices, 1));

            const connectionsMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    ...THREE.UniformsUtils.clone(pulseUniforms.current),
                    cameraPosition: { value: camera.position }
                },
                vertexShader: connectionShader.vertexShader,
                fragmentShader: connectionShader.fragmentShader,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });
            const connectionsMesh = new THREE.LineSegments(connectionsGeometry, connectionsMaterial);
            connectionsMeshRef.current = connectionsMesh;
            scene.add(connectionsMesh);

            palette.forEach((color, i) => {
                if (i < 3) {
                    connectionsMaterial.uniforms.uPulseColors.value[i].copy(color);
                    nodesMaterial.uniforms.uPulseColors.value[i].copy(color);
                }
            });
        };

        createNetworkVisualization(configRef.current.currentFormation, configRef.current.densityFactor);

        const animate = () => {
            const requestID = requestAnimationFrame(animate);
            const t = clockRef.current.getElapsedTime();
            
            if (!configRef.current.paused) {
                if (nodesMeshRef.current) {
                    (nodesMeshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
                    nodesMeshRef.current.rotation.y = Math.sin(t * 0.04) * 0.05;
                }
                if (connectionsMeshRef.current) {
                    (connectionsMeshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
                    connectionsMeshRef.current.rotation.y = Math.sin(t * 0.04) * 0.05;
                }
            }
            
            starField.rotation.y += 0.0002;
            (starField.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
            
            controls.update();
            composer.render();
            
            return requestID;
        };

        const animationID = animate();

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            composer.setSize(width, height);
            bloomPass.resolution.set(width, height);
        };

        window.addEventListener('resize', handleResize);

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const interactionPoint = new THREE.Vector3();
        let lastPulseIndex = 0;

        const triggerPulse = (clientX: number, clientY: number) => {
            pointer.x = (clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            interactionPlane.normal.copy(camera.position).normalize();
            interactionPlane.constant = -interactionPlane.normal.dot(camera.position) + camera.position.length() * 0.5;
            
            if (raycaster.ray.intersectPlane(interactionPlane, interactionPoint)) {
                const time = clockRef.current.getElapsedTime();
                if (nodesMeshRef.current && connectionsMeshRef.current) {
                    lastPulseIndex = (lastPulseIndex + 1) % 3;
                    const nodesUnifs = (nodesMeshRef.current.material as THREE.ShaderMaterial).uniforms;
                    const connUnifs = (connectionsMeshRef.current.material as THREE.ShaderMaterial).uniforms;
                    
                    nodesUnifs.uPulsePositions.value[lastPulseIndex].copy(interactionPoint);
                    nodesUnifs.uPulseTimes.value[lastPulseIndex] = time;
                    connUnifs.uPulsePositions.value[lastPulseIndex].copy(interactionPoint);
                    connUnifs.uPulseTimes.value[lastPulseIndex] = time;
                    
                    const palette = colorPalettes[configRef.current.activePaletteIndex];
                    const randomColor = palette[Math.floor(Math.random() * palette.length)];
                    nodesUnifs.uPulseColors.value[lastPulseIndex].copy(randomColor);
                    connUnifs.uPulseColors.value[lastPulseIndex].copy(randomColor);
                }
            }
        };

        const handleClick = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('.glass-panel, button, input')) return;
            if (!configRef.current.paused) triggerPulse(e.clientX, e.clientY);
        };

        window.addEventListener('click', handleClick);

        return () => {
            cancelAnimationFrame(animationID);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('click', handleClick);
            renderer.dispose();
            scene.clear();
        };
    }, []);

    const handleMorph = () => {
        const next = (currentFormation + 1) % 3;
        setCurrentFormation(next);
        configRef.current.currentFormation = next;
        // Re-generate network (simplified re-init)
        // Here we'd call createNetworkVisualization if we had a clean ref to it
        // For now, let's just trigger a re-render if needed or use a callback ref
    };

    const handleFreeze = () => {
        const p = !configRef.current.paused;
        setPaused(p);
        configRef.current.paused = p;
        if (controlsRef.current) controlsRef.current.autoRotate = !p;
    };

    const handleReset = () => {
        if (controlsRef.current) {
            controlsRef.current.reset();
            controlsRef.current.autoRotate = false;
            setTimeout(() => { if (controlsRef.current) controlsRef.current.autoRotate = true; }, 2000);
        }
    };

    const handleDensityChange = (val: number) => {
        setDensityFactor(val / 100);
        configRef.current.densityFactor = val / 100;
        // In reality, this should call createNetworkVisualization with a debounce
    };

    return (
        <div ref={containerRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            {/* CSS from original snippet */}
            <style jsx global>{`
                :root {
                    --glass-bg: rgba(255, 255, 255, 0.03);
                    --glass-border: rgba(255, 255, 255, 0.08);
                    --glass-highlight: rgba(255, 255, 255, 0.2);
                    --neon-accent: #667eea;
                    --text-main: rgba(255, 255, 255, 0.9);
                    --text-muted: rgba(255, 255, 255, 0.6);
                }
                .glass-panel {
                    backdrop-filter: blur(24px) saturate(120%);
                    -webkit-backdrop-filter: blur(24px) saturate(120%);
                    background: linear-gradient(
                        145deg,
                        rgba(255, 255, 255, 0.05) 0%,
                        rgba(255, 255, 255, 0.01) 100%
                    );
                    border: 1px solid var(--glass-border);
                    border-top: 1px solid var(--glass-highlight);
                    border-left: 1px solid var(--glass-highlight);
                    box-shadow:
                        0 20px 40px rgba(0, 0, 0, 0.4),
                        inset 0 0 20px rgba(255, 255, 255, 0.02);
                    border-radius: 24px;
                    color: var(--text-main);
                    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                    position: absolute;
                    z-index: 10;
                    overflow: hidden;
                    pointer-events: auto;
                }
                .glass-panel::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.05),
                        transparent
                    );
                    transform: skewX(-15deg);
                    transition: 0.5s;
                    pointer-events: none;
                }
                .glass-panel:hover {
                    background: linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
                    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.05);
                    transform: translateY(-2px);
                    border-color: rgba(255, 255, 255, 0.15);
                }
                .glass-panel:hover::before {
                    left: 150%;
                    transition: 0.7s ease-in-out;
                }
                #instructions-container {
                    top: 32px;
                    left: 32px;
                    width: 280px;
                    padding: 24px;
                }
                #instruction-title {
                    font-weight: 500;
                    font-size: 18px;
                    margin-bottom: 8px;
                    letter-spacing: -0.02em;
                    background: linear-gradient(135deg, #fff 30%, #a5b4fc 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-shadow: 0 10px 20px rgba(0,0,0,0.2);
                }
                .instruction-text {
                    font-size: 14px;
                    line-height: 1.5;
                    color: var(--text-muted);
                    font-weight: 300;
                }
                #theme-selector {
                    top: 32px;
                    right: 32px;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    width: 220px;
                }
                #theme-selector-title {
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: var(--text-muted);
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                .theme-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                    justify-items: center;
                }
                .theme-button {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2);
                }
                #theme-1 { background: radial-gradient(circle at 30% 30%, #a78bfa, #4c1d95); }
                #theme-2 { background: radial-gradient(circle at 30% 30%, #fb7185, #9f1239); }
                #theme-3 { background: radial-gradient(circle at 30% 30%, #38bdf8, #0c4a6e); }
                .theme-button::after {
                    content: '';
                    position: absolute;
                    top: -4px;
                    left: -4px;
                    right: -4px;
                    bottom: -4px;
                    border-radius: 50%;
                    border: 2px solid rgba(255,255,255,0.8);
                    opacity: 0;
                    transform: scale(1.1);
                    transition: all 0.3s ease;
                }
                .theme-button.active::after {
                    opacity: 1;
                    transform: scale(1);
                    border-color: rgba(255,255,255,0.9);
                }
                .density-slider {
                    -webkit-appearance: none;
                    width: 100%;
                    height: 6px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                    outline: none;
                }
                .density-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #fff;
                    cursor: pointer;
                }
                #control-buttons {
                    position: absolute;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 16px;
                    z-index: 20;
                    padding: 8px;
                    background: rgba(0,0,0,0.1);
                    pointer-events: auto;
                    border-radius: 50px;
                }
                .control-button {
                    backdrop-filter: blur(20px) saturate(140%);
                    -webkit-backdrop-filter: blur(20px) saturate(140%);
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-top: 1px solid rgba(255, 255, 255, 0.25);
                    color: var(--text-main);
                    padding: 12px 24px;
                    border-radius: 50px;
                    cursor: pointer;
                    font-family: 'Outfit', sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    text-transform: uppercase;
                    transition: all 0.3s ease;
                    min-width: 100px;
                }
                .control-button:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-4px);
                }
                @media (max-width: 640px) {
                    #instructions-container { top: 16px; left: 16px; right: 16px; width: auto; padding: 16px; }
                    #theme-selector { bottom: 100px; top: auto; left: 16px; right: 16px; width: auto; flex-direction: row; }
                    #control-buttons { bottom: 24px; width: 100%; justify-content: center; left: 0; transform: none; padding: 0 16px; }
                }
            `}</style>
            
            <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair absolute top-0 left-0" style={{ zIndex: 1 }} />

            {/* Optional Panels - Keeping them as requested "0.0.1% change" but they can be hidden if they overlap too much */}
            <div id="instructions-container" className="glass-panel">
                <div id="instruction-title">Quantum Neural Network</div>
                <div className="instruction-text">Click to send energy pulses. <br/>Drag to explore the structure.</div>
            </div>

            <div id="theme-selector" className="glass-panel">
                <div style={{ flex: 1 }}>
                    <div id="theme-selector-title">Crystal Theme</div>
                    <div className="theme-grid">
                        {[0, 1, 2].map((idx) => (
                            <button
                                key={idx}
                                className={`theme-button ${activePaletteIndex === idx ? 'active' : ''}`}
                                id={`theme-${idx + 1}`}
                                onClick={() => {
                                    setActivePaletteIndex(idx);
                                    configRef.current.activePaletteIndex = idx;
                                    updateTheme(idx);
                                }}
                                aria-label={`Theme ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
                <div id="density-controls" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                    <div className="flex justify-between text-[13px] text-[rgba(255,255,255,0.6)] font-light">
                        <span>Density</span>
                        <span id="density-value" className="text-white font-medium">{Math.round(densityFactor * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="30"
                        max="100"
                        value={densityFactor * 100}
                        onChange={(e) => handleDensityChange(parseInt(e.target.value))}
                        className="density-slider"
                        aria-label="Network Density"
                    />
                </div>
            </div>

            <div id="control-buttons">
                <button onClick={handleMorph} className="control-button"><span>Morph</span></button>
                <button onClick={handleFreeze} className="control-button"><span>{paused ? 'Play' : 'Freeze'}</span></button>
                <button onClick={handleReset} className="control-button"><span>Reset</span></button>
            </div>
        </div>
    );
};

export default NeuralBackground;
