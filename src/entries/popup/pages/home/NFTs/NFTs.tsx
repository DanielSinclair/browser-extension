import React, { useRef } from 'react';

import { useCurrentAddressStore } from '~/core/state';
import { useTestnetModeStore } from '~/core/state/currentSettings/testnetMode';
import { useNftsStore } from '~/core/state/nfts';
import { UniqueAsset } from '~/core/types/nfts';
import { Bleed, Box } from '~/design-system';
import { useNftShortcuts } from '~/entries/popup/hooks/useNftShortcuts';
import { useRainbowNavigate } from '~/entries/popup/hooks/useRainbowNavigate';
import { useUserChains } from '~/entries/popup/hooks/useUserChains';
import { ROUTES } from '~/entries/popup/urls';

import NFTCollections from './NFTCollections';
import NFTGallery from './NFTGallery';

export function NFTs() {
  const { currentAddress: address } = useCurrentAddressStore();
  const sort = useNftsStore.use.sort();
  const displayMode = useNftsStore.use.displayMode();
  const { testnetMode } = useTestnetModeStore();
  const { chains: userChains } = useUserChains();
  const navigate = useRainbowNavigate();
  const onAssetClick = (asset: UniqueAsset) => {
    navigate(
      ROUTES.NFT_DETAILS(asset?.collection.collection_id || '', asset?.id),
      {
        state: {
          nft: asset,
        },
      },
    );
  };

  const groupedContainerRef = useRef<HTMLDivElement>(null);
  const byCollectionContainerRef = useRef<HTMLDivElement>(null);
  useNftShortcuts();

  return (
    <Bleed top="10px">
      {displayMode === 'grouped' ? (
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          width="full"
          paddingHorizontal="12px"
          paddingBottom="28px"
          ref={groupedContainerRef}
        >
          <NFTGallery
            address={address}
            onAssetClick={onAssetClick}
            sort={sort}
            testnetMode={testnetMode}
            userChains={userChains}
            containerRef={groupedContainerRef}
          />
        </Box>
      ) : (
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          width="full"
          paddingHorizontal="12px"
          paddingBottom="28px"
          ref={byCollectionContainerRef}
        >
          <NFTCollections
            address={address}
            onAssetClick={onAssetClick}
            sort={sort}
            testnetMode={testnetMode}
            userChains={userChains}
            containerRef={byCollectionContainerRef}
          />
        </Box>
      )}
    </Bleed>
  );
}
