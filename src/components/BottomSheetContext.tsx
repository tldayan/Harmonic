import React, { createContext, useRef, useContext, useState } from 'react';
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';

type BottomSheetContextType = {
    open: (content: React.ReactNode, options?: { snapPoints?: (string | number)[] }) => void;
    close: () => void;
  };
  

const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

export const useBottomSheet = () => {
  const ctx = useContext(BottomSheetContext);
  if (!ctx) throw new Error('BottomSheetProvider is missing');
  return ctx;
};

export const BottomSheetProvider = ({ children }: { children: React.ReactNode }) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [sheetContent, setSheetContent] = useState<React.ReactNode>(null);
  const [dynamicSnapPoints, setDynamicSnapPoints] = useState<(string | number)[]>(['25%', '50%']);

  const open = (
    content: React.ReactNode,
    options?: { snapPoints?: (string | number)[] }
  ) => {
    if (options?.snapPoints) {
      setDynamicSnapPoints(options.snapPoints);
    } else {
      setDynamicSnapPoints(['25%']); // default
    }
  
    setSheetContent(content);
    bottomSheetRef.current?.present();
  };
  

  const close = () => {
    bottomSheetRef.current?.close();
  };
  
  const handleDismiss = () => {
    setSheetContent(null);
  };

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="close" 
    />
  );
  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    stiffness: 500,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
  });

  return (
    <BottomSheetModalProvider>
      <BottomSheetContext.Provider value={{ open, close }}>
        {children}

<BottomSheetModal
  ref={bottomSheetRef}
  index={0}
  snapPoints={dynamicSnapPoints}
  enablePanDownToClose
  animationConfigs={animationConfigs}
  enableDismissOnClose
  onDismiss={handleDismiss}
  keyboardBehavior="interactive"              
  backdropComponent={renderBackdrop}
>
<BottomSheetView key="bottom-sheet-view" style={{ padding: 20, paddingTop: 0 }}>
  {sheetContent}
</BottomSheetView>

</BottomSheetModal>
      </BottomSheetContext.Provider>
    </BottomSheetModalProvider>
  );
};
