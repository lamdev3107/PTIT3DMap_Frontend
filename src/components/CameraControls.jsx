const CameraControls = ({
  selectedBuilding,
  isTourActive,
  currentTourIndex,
  onTourNextBuilding,
  // onScrollToBuildingIndex,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef(null);
  const targetPositionRef = useRef(new THREE.Vector3(0, 5, 10));
  const targetRotationRef = useRef(new THREE.Euler(0, 0, 0));
  const timeoutRef = useRef(null);
  const tourTimerRef = useRef(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    // const handleIdleMovement = () => {
    //   if (!selectedBuilding && !isTourActive && !isAnimatingRef.current) {
    //     const radius = 12;
    //     const angle = Math.random() * Math.PI * 2;
    //     const height = 5 + Math.random() * 3;

    //     const x = Math.sin(angle) * radius;
    //     const z = Math.cos(angle) * radius;

    //     targetPositionRef.current = new THREE.Vector3(x, height, z);
    //     targetRotationRef.current = new THREE.Euler(
    //       -0.2 - Math.random() * 0.1,
    //       angle + Math.PI,
    //       0
    //     );

    //     timeoutRef.current = window.setTimeout(
    //       handleIdleMovement,
    //       8000 + Math.random() * 5000
    //     );
    //   }
    // };

    // if (!selectedBuilding && !isTourActive) {
    //   handleIdleMovement();
    // }

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      if (tourTimerRef.current !== null) {
        clearTimeout(tourTimerRef.current);
      }
    };
  }, [selectedBuilding, isTourActive]);

  console.log("Check isTourActive", isTourActive);
  useEffect(() => {
    if (!isTourActive) {
      isAnimatingRef.current = true;
      const building = BUILDINGS[currentTourIndex];

      const position = new THREE.Vector3(
        building.position[0],
        building.position[1] + 2.5,
        building.position[2] + 3.5
      );

      const targetRotation = new THREE.Euler();
      const lookAtPosition = new THREE.Vector3(...building.position);

      const dummyCamera = new THREE.Object3D();
      dummyCamera.position.copy(position);
      dummyCamera.lookAt(lookAtPosition);
      targetRotation.copy(dummyCamera.rotation);

      const startPosition = camera.position.clone();
      const startRotation = camera.rotation.clone();
      const startTime = Date.now();
      const duration = 3000;

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeOutCubic(progress);

        camera.position.lerpVectors(startPosition, position, easeProgress);

        camera.rotation.x =
          startRotation.x + (targetRotation.x - startRotation.x) * easeProgress;
        camera.rotation.y =
          startRotation.y + (targetRotation.y - startRotation.y) * easeProgress;
        camera.rotation.z =
          startRotation.z + (targetRotation.z - startRotation.z) * easeProgress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isAnimatingRef.current = false;
          if (isTourActive) {
            tourTimerRef.current = window.setTimeout(() => {
              onTourNextBuilding();
            }, 3000);
          }
        }
      };

      animate();
    }

    return () => {
      if (tourTimerRef.current) {
        clearTimeout(tourTimerRef.current);
      }
    };
  }, [isTourActive, currentTourIndex, camera, onTourNextBuilding]);

  const easeOutCubic = (x) => {
    return 1 - Math.pow(1 - x, 3);
  };

  useFrame((_, delta) => {
    if (controlsRef.current) {
      // if (!selectedBuilding && !isTourActive && !isAnimatingRef.current) {
      //   const lerpFactor = 0.01;
      //   const distanceToTarget = camera.position.distanceTo(
      //     targetPositionRef.current
      //   );
      //   if (distanceToTarget > 0.05) {
      //     camera.position.lerp(targetPositionRef.current, lerpFactor);
      //     const currentRotation = new THREE.Euler().copy(camera.rotation);
      //     camera.rotation.x +=
      //       (targetRotationRef.current.x - currentRotation.x) * lerpFactor;
      //     camera.rotation.y +=
      //       (targetRotationRef.current.y - currentRotation.y) * lerpFactor;
      //     camera.rotation.z +=
      //       (targetRotationRef.current.z - currentRotation.z) * lerpFactor;
      //   }
      //   controlsRef.current.target.set(0, 0, 0);
      // }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.02}
      minDistance={4}
      maxDistance={16}
      maxPolarAngle={Math.PI / 2}
      enableRotate={false}
      enableZoom={false}
      enablePan={false}
      rotateSpeed={0.2}
    />
  );
};
