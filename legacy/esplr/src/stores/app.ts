import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', () => {
  const networkName = ref('');
  const chainId = ref(0);
  const rpcUrl = ref('');
  const isErigon = ref(false);
  const otsApiError = ref(false);

  function setNetworkName(name: string) {
    networkName.value = name;
  }

  function setChainId(id: number) {
    chainId.value = id;
  }

  function setRpcUrl(url: string) {
    rpcUrl.value = url;
  }

  function setIsErigon(value: boolean) {
    isErigon.value = value;
  }

  function setOtsApiError(value: boolean) {
    otsApiError.value = value;
  }

  return {
    setNetworkName,
    networkName,
    setRpcUrl,
    rpcUrl,
    setIsErigon,
    isErigon,
    otsApiError,
    setOtsApiError,
    chainId,
    setChainId,
  };
});
