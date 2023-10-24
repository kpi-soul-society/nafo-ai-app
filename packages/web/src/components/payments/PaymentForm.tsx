'use client';
import { Fragment, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  calculateTokensFromPrice,
  CURRENCY_TO_TOKEN_EXCHANGE_RATE,
  PaymentCurrency,
} from '@nafo-ai/core/common/payment';
import { PaymentShema, paymentShema } from '@nafo-ai/core/common/validation';
import debounce from 'debounce';
import Image from 'next/image';

const DONATION_PRESET = [
  {
    id: 'pup_pack',
    name: 'Pup Pack',
    tokens: 5,
    image: '/assets/cheems.jpg',
  },
  {
    id: 'doggo_pack',
    name: 'Doggo Pack',
    tokens: 25,
    image: '/assets/cheebs_original.png',
  },
  {
    id: 'woofer_pack',
    name: 'Woofer Pack',
    tokens: 50,
    image: '/assets/buff_cheebs.png',
  },
];

interface PaymentFormProps {
  handlePayment: ({ amount, currency }: { amount: number; currency: PaymentCurrency }) => void;
  titleClass?: string;
}

export const PaymentForm = ({
  handlePayment,
  titleClass = 'text-3xl md:text-3xl lg:text-5xl 2xl:text-6xl',
}: PaymentFormProps) => {
  const formMethods = useForm<PaymentShema>({
    mode: 'onChange',
    defaultValues: {
      price: 0,
      currency: { symbol: '$', name: PaymentCurrency.USD, tokenRate: 5 },
    },
    resolver: async (data, context, options) => {
      return zodResolver(paymentShema)(data, context, options);
    },
  });
  const { errors } = formMethods.formState;
  const error = Object.values(errors)[0]?.message;

  const [selectedPack, setSelectedPack] = useState('');
  const [isCustomPackSelected, setIsCustomPackSelected] = useState(false);

  const onCustomPackClick = () => {
    setIsCustomPackSelected(!isCustomPackSelected);
    setSelectedPack('');
    formMethods.setValue('price', 0);
  };

  const onPackSelection = async (id = '', tokens = 5) => {
    if (isCustomPackSelected) {
      setIsCustomPackSelected(false);
    } else if (selectedPack === id) {
      setSelectedPack('');
      formMethods.setValue('price', 0);
    } else {
      setSelectedPack(id);
      const { tokenRate } = formMethods.getValues().currency;
      const price = Math.round(tokens / tokenRate);
      formMethods.setValue('price', price);
      await formMethods.trigger('price');
    }
  };

  const onCurrencySelection = async ({ symbol = '$', name = PaymentCurrency.USD, tokenRate = 5 }) => {
    formMethods.setValue('currency', { symbol, name, tokenRate });
    await formMethods.trigger('currency');

    // for cases when user selected pack and switched currency
    if (selectedPack && selectedPack !== '') {
      const pack = DONATION_PRESET.find((p) => p.id === selectedPack);
      if (pack) {
        const price = Math.round(pack.tokens / tokenRate);
        formMethods.setValue('price', price);
      }
    }
  };

  const onPriceEnter = debounce(async (price = 1) => {
    formMethods.setValue('price', price);
    await formMethods.trigger('price');
  }, 500);

  const onSubmit = (data: PaymentShema) => {
    // we should always send the price in cents
    handlePayment({ amount: Math.round(data.price) * 100, currency: data.currency.name });
  };

  const getPackPrice = (tokens = 5) => {
    const { tokenRate, symbol } = formMethods.getValues().currency;
    const price = Math.round(tokens / tokenRate);
    return price + symbol;
  };

  const getTokens = () => {
    const { price, currency } = formMethods.getValues();
    return calculateTokensFromPrice(price, currency.tokenRate);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <span className={titleClass}>Pick your contribution</span>
          <Menu as="div" className="relative inline-block text-left text-3xl font-medium text-white 2xl:text-4xl">
            <div>
              <Menu.Button className="bg-yield flex w-full items-center justify-between gap-2 rounded-lg px-4 py-2 transition-colors duration-700  hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 sm:min-w-[8.2rem] sm:justify-start">
                <span className="block sm:hidden">Currency:</span>
                <span>{formMethods.getValues().currency.name}</span>
                <span>{formMethods.getValues().currency.symbol}</span>
                <ChevronDownIcon className="h-10" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute left-0 top-[calc(100%+8px)] z-20 ml-1 origin-top-right divide-y divide-white rounded-md bg-white text-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {CURRENCY_TO_TOKEN_EXCHANGE_RATE.map(({ symbol, name, tokenRate }) => (
                  <Menu.Item key={name}>
                    <button
                      type="button"
                      onClick={() => {
                        onCurrencySelection({ symbol, name: name as PaymentCurrency, tokenRate });
                      }}
                      className="flex w-full items-center gap-2 p-2 px-3 transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-indigo-500 hover:text-white"
                    >
                      <span>{name}</span>
                      <span>{symbol}</span>
                    </button>
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <div className="font-russo scroll flex flex-nowrap justify-stretch gap-4 overflow-x-scroll lg:overflow-x-auto">
          {DONATION_PRESET.map(({ id, name, tokens, image }) => (
            <div
              key={id}
              className={`${
                selectedPack === id && 'bg-secondary text-white'
              } flex aspect-square w-full flex-col gap-4 rounded-md border p-6 shadow-xl transition-colors lg:p-8`}
              onClick={() => {
                onPackSelection(id, tokens);
              }}
            >
              <span className="text-xl lg:text-3xl 2xl:text-4xl">{name}</span>
              <div className="flex items-center gap-4">
                <div className="relative aspect-square w-16 lg:w-20 2xl:w-28">
                  <Image
                    src={selectedPack === id ? '/assets/tokens_white.png' : '/assets/tokens.png'}
                    fill
                    alt="tokens"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <span className="lg:text-xl 2xl:text-2xl">{tokens} tokens</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-3xl lg:text-5xl 2xl:text-6xl">{getPackPrice(tokens)}</span>
                <div className="relative aspect-[17/19] w-20 2xl:w-28">
                  <Image
                    src={image}
                    fill
                    alt="tokens"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            </div>
          ))}
          <div
            className={`${
              isCustomPackSelected && 'bg-secondary text-white'
            } flex min-w-[10rem] flex-col rounded-md border p-8 shadow-xl transition-colors lg:min-w-[12rem] 2xl:min-w-[14rem]`}
            onClick={onCustomPackClick}
          >
            <span className="flex max-w-[6rem] flex-wrap text-xl lg:text-3xl 2xl:text-4xl">Custom Donation</span>
            <div className="flex h-full items-center justify-center">
              <div className="relative aspect-[13/10] w-40">
                <Image
                  src={isCustomPackSelected ? '/assets/tokens_box_white.png' : '/assets/tokens_box.png'}
                  fill
                  alt="tokens"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>
        {isCustomPackSelected && (
          <input
            onChange={(e) => {
              onPriceEnter(Number(e.target.value));
            }}
            type="number"
            placeholder="Enter your donation"
            className="font-russo w-full rounded-lg border border-gray-300 p-4 text-2xl shadow-sm focus:outline-indigo-500 2xl:p-5"
          />
        )}
        <h3 className="text-red-500">{error}</h3>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          {isCustomPackSelected && (
            <div className="font-russo flex items-center gap-6 text-2xl">
              <span className="min-w-[8rem] text-3xl 2xl:text-5xl">Tokens: {getTokens()}</span>
              <div className="relative aspect-square w-12 2xl:w-16">
                <Image
                  src="/assets/token.png"
                  fill
                  alt="token"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          )}
          <input
            type="submit"
            value="Donatello"
            className={`${
              !isCustomPackSelected && 'w-full'
            } bg-yield disabled:bg-lavander min-w-[15rem] rounded-md px-7 py-2 text-3xl font-semibold text-white shadow-sm transition-colors duration-700 hover:cursor-pointer hover:bg-indigo-500 md:text-2xl lg:text-4xl 2xl:py-3 2xl:text-5xl`}
            disabled={!!formMethods?.formState?.errors?.price?.message}
          />
        </div>
      </form>
    </FormProvider>
  );
};
