"use client";

import {Progress} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {usePathname, useSearchParams} from "next/navigation";

export const TopProgress = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show bar
    setVisible(true);
    setProgress(30);

    const t1 = setTimeout(() => setProgress(70), 150);
    const t2 = setTimeout(() => setProgress(100), 300);

    // Hide bar after finish
    const t3 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 500); // delay before hiding

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <Progress.Root
      w="full"
      maxW="full"
      value={progress}
      size="xs"
      position="fixed"
      top="0"
      left="0"
      zIndex="9999"
      animated
      variant="subtle"
    >
      <Progress.Track
        style={{borderRadius: '0 !important', border: '0 !important', background: 'transparent !important'}}>
        <Progress.Range/>
      </Progress.Track>
    </Progress.Root>
  );
};
