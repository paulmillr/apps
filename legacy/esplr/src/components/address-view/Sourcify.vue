<script setup lang="ts">
import { onMounted, ref, computed, inject } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { useAppStore } from '@/stores/app';

const net = inject<Function>('net');
if (!net) throw new Error('Net not found!');

const loadingMetadata = ref(false);
const metadata = ref({});
const settingsStore = useSettingsStore();
const appStore = useAppStore();

const matchType = ref('');
const contractName = ref('');
const compilationTarget = ref('');
const language = ref('');
const compiler = ref('');
const optimizerEnabled = ref(null);
const optimizerRuns = ref('');
const methods = ref<string[]>([]);
const abi = ref([]);

const props = defineProps<{
  address: string;
}>();

const noMetadata = computed(() => {
  return !Object.keys(metadata.value).length && !loadingMetadata.value;
});

const isMetadata = computed(() => {
  return Object.keys(metadata.value).length > 0 && !loadingMetadata.value;
});

onMounted(async () => {
  await fetchMetadata();
});

const fetchMetadata = async () => {
  loadingMetadata.value = true;

  let matchDir = 'full_match';
  const sourcifyUrl = settingsStore.sourcifyUrl;
  const chainId = appStore.chainId;
  const address = props.address;
  let result = await net(`${sourcifyUrl}/${matchDir}/${chainId}/${address}/metadata.json`);
  if (!result.ok) {
    matchDir = 'partial_match';
    result = await net(`${sourcifyUrl}/${matchDir}/${chainId}/${address}/metadata.json`);
    if (!result.ok) {
      console.error('Sourcify metadata not found for address:', address);
      loadingMetadata.value = false;
      return;
    }
  }

  const json = await result.json();
  metadata.value = json;

  matchType.value = matchDir;

  if (json.settings?.compilationTarget && Object.keys(json.settings.compilationTarget).length > 0) {
    const fileName = Object.keys(json.settings.compilationTarget)[0];
    compilationTarget.value = fileName;
    contractName.value = json.settings.compilationTarget[fileName];
  }

  language.value = json.language;
  compiler.value = json.compiler?.version;

  optimizerEnabled.value = json.settings?.optimizer?.enabled;
  optimizerRuns.value = json.settings?.optimizer?.runs;

  const devDoc = json.output.devdoc;
  methods.value = Object.keys(devDoc.methods || {});

  abi.value = json.output.abi;

  loadingMetadata.value = false;
};
</script>

<template>
  <div class="details-header">
    <b>Metadata</b> <span v-if="loadingMetadata" class="spinner"></span>
  </div>

  <div class="warning" v-if="noMetadata">
    ⚠️ No data found for this contract in sourcify archive. Check the following:
    <ul>
      <li>address is a contract</li>
      <li>server is running and CORS headers configured properly</li>
      <li>
        server root points to path where directories "full_match" and "partial_match" are located
        alongside
      </li>
      <li>contract address is presented inside your sourcify archive</li>
      <li>name of the directory which points to the address is in lowercase format</li>
    </ul>
  </div>

  <div v-if="isMetadata" class="info">
    <div class="field">
      <div class="field-title">Match type:</div>
      <div class="hash">
        <span v-if="matchType === 'full_match'">✅ Full match</span>
        <span v-if="matchType === 'partial_match'">ℹ Partial match</span>
      </div>
    </div>
    <div class="field">
      <div class="field-title">Contract name:</div>
      <div class="hash">
        {{ contractName }} <span v-if="compilationTarget.length">({{ compilationTarget }})</span>
      </div>
    </div>
    <div class="field">
      <div class="field-title">Language:</div>
      <div class="hash">{{ language }}</div>
    </div>
    <div v-if="compiler.length" class="field">
      <div class="field-title">Compiler:</div>
      <div class="hash">{{ compiler }}</div>
    </div>

    <div class="field">
      <div class="field-title">Optimizer:</div>
      <div class="hash">
        {{ optimizerEnabled !== null ? optimizerEnabled : '-' }}
        <span v-if="optimizerEnabled && optimizerRuns">({{ optimizerRuns }} runs)</span>
      </div>
    </div>
    <div v-if="methods.length" class="field methods-field">
      <div class="field-title">Methods:</div>
      <div class="hash">
        <ul class="methods">
          <li v-for="(method, index) in methods" :key="index">
            <code>{{ method }}</code>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div v-if="methods.length" class="abi-header">
    <b>ABI raw</b>
  </div>
  <div class="abi-info" v-if="abi.length">
    <pre>{{ abi }}</pre>
  </div>
</template>

<style>
.details-header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 7px;
}

.abi-header {
  margin-top: 15px;
  margin-bottom: 5px;
}

.methods {
  margin: 0;
  padding-left: 20px;
}

.abi-info pre {
  max-height: 500px;
}

.info {
  justify-content: space-between;
  border: 1px solid var(--ash-grey);
  border-radius: var(--std-radius);
  padding: 0 12px;
  margin-bottom: 15px;
  word-break: break-all;
}

.field {
  display: flex;
  flex-direction: column;
  padding: 7px 0px;
  border-bottom: 1px solid var(--ash-grey);
}

@media (min-width: 425px) {
  .field {
    flex-direction: row;
  }
}

.field:last-child {
  border-bottom: none;
}

.field-title {
  display: inline-block;
  font-weight: 600;
  font-size: 18px;
  min-width: 160px;
}

.hash {
  font-size: 18px;
}

.warning ul {
  margin-top: 10px;
}

.methods code {
  font-size: 16px;
}

.methods-field {
  flex-direction: column;
}
</style>
