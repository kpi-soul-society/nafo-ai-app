import useDownloader from 'react-use-downloader';
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  CloudArrowDownIcon,
  DocumentDuplicateIcon,
  GlobeAltIcon,
  TrashIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

import { useCarouselContext } from '@/lib/contexts/CarouselProvider';
import { WithId } from '@/lib/hooks/useChipControls';

import { AsyncButton } from '../common/AsyncButton';
import { Carousel } from '../common/Carousel';

interface CheebsSettingProps {
  textPrompt: string;
  mainUrl: string;
  handleEvolve: () => void;
  handleSetRef: (_: string) => void;
  handleDelete: () => void;
  handleSetMain: (_: string) => void;
  handlePublish: (_: WithId) => void;
  handleUnpublish: (_: WithId) => void;
}

export const CheebsSettings = ({
  textPrompt,
  mainUrl,
  handleEvolve,
  handleDelete,
  handleSetMain,
  handleSetRef,
  handlePublish,
  handleUnpublish,
}: CheebsSettingProps) => {
  const { items, selectedItem, goFirst } = useCarouselContext();
  const { download } = useDownloader();

  const handleDownload = () => {
    download(items[selectedItem].imageUrl!, 'cheebs.png');
  };

  const SETTINGS_ACTIONS = [
    {
      name: 'Evolve',
      onClick: () => handleEvolve(),
      icon: <ArrowPathIcon className="h-6" />,
    },
    {
      name: 'Img2Img',
      onClick: () => handleSetRef(items[selectedItem].imageUrl),
      icon: <DocumentDuplicateIcon className="h-6" />,
    },
    {
      name: 'Publish',
      onClick: async () => handlePublish({ id: items[selectedItem].id }),
      icon: <GlobeAltIcon className="h-6" />,
      isHidden: items[selectedItem].isSharedToCommunity,
    },
    {
      name: 'Unpublish',
      onClick: () => handleUnpublish({ id: items[selectedItem].id }),
      icon: <CloudArrowDownIcon className="h-6" />,
      isHidden: !items[selectedItem].isSharedToCommunity,
    },
    {
      name: 'Download',
      onClick: () => {
        handleDownload();
      },
      icon: <ArrowDownTrayIcon className="h-6" />,
    },
    {
      name: 'Delete',
      onClick: () => handleDelete(),
      icon: <TrashIcon className="h-6" />,
    },
    {
      name: 'Set Main',
      onClick: async () => {
        await handleSetMain(items[selectedItem].imageUrl);
        goFirst();
      },
      icon: <TrophyIcon className="h-6" />,
      isHidden: mainUrl === items[selectedItem].imageUrl,
    },
  ];
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="flex flex-col-reverse gap-5 sm:flex-row">
        <div className="flex flex-wrap justify-center gap-2 sm:flex-col sm:justify-start">
          {SETTINGS_ACTIONS.map(({ name, onClick, icon, isHidden }) => (
            <AsyncButton
              key={name}
              onClick={onClick}
              disabledClassName="hover:bg-lavander"
              className={`${
                isHidden ? 'hidden' : 'flex'
              } bg-lavander hover:bg-secondary w-full max-w-[8rem] items-center justify-center gap-2 rounded-2xl p-2 text-sm transition-all hover:text-white sm:max-w-[9rem] sm:text-lg`}
            >
              {icon} {name}
            </AsyncButton>
          ))}
        </div>
        <div className="flex max-h-24 w-full min-w-0 max-w-lg overflow-y-auto px-4 text-2xl font-semibold capitalize sm:hidden">
          {textPrompt}
        </div>
        <div className="flex flex-grow pr-5">
          <Carousel />
        </div>
      </div>
      <div className="hidden max-h-16 w-full min-w-0 max-w-lg overflow-y-auto px-4 text-2xl font-semibold capitalize sm:flex">
        {textPrompt}
      </div>
    </div>
  );
};
