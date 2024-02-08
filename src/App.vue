<template>
  <div class="flex flex-col min-h-screen bg-gray-100 bg-slate-500">
    <header class="bg-blue-500 text-white p-4">
      <h1 class="text-3xl font-bold w-3/4 mx-auto">LinkSnip</h1>
    </header>
    <main class="flex-1 p-4 flex flex-col md:flex-row mx-auto w-3/4 bg-slate-100">
      <section class="shorten-section flex-1 md:mr-4 mb-4 md:mb-0">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">Shorten your link!</h2>
        <form @submit.prevent="shortenLink" class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:w-3/5">
          <label for="originalLink" class="sr-only">Original Link:</label>
          <input type="url" id="originalLink" v-model="originalLink" required placeholder="Enter your link" class="flex-1 p-3 border border-blue-500 rounded focus:outline-none focus:border-blue-700 text-gray-400" />
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700 ml-2">Shorten</button>
        </form>
      </section>

      <aside class="history-sidebar w-full md:w-2/6 sd:w-full p-4 bg-gray-200 rounded-md md:text-balance">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">Shortened URLs History</h2>
        <ul>
          <li v-for="(shortLink, index) in shortenedLinks" :key="index" class="mb-2 border border-sky-500 p-2 rounded-md flex justify-between">
            <div>
              <div class="flex items-center space-x-2 w-ma sd:flex-col flex-row">
                <a :href="shortLink.shortened" target="_blank" class="text-blue-500 hover:underline p-0">{{ shortLink.shortened }}</a>
                <button @click="copyToClipboard(shortLink.shortened)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700">Copy</button>
              </div>
              <p class="text-gray-400 mt-2">{{ shortLink.original.substring(0, 35) + '...' }}</p>
            </div>
            <button @click="removeLink(index)" class="text-red-500 hover:text-red-700 focus:outline-none mr-5">
              <i class="fas fa-trash-alt text-2xl"></i>
            </button>
          </li>
        </ul>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted} from 'vue';

interface Data {
  originalLink: string;
  shortenedLinks: { original: string; shortened: string; title: string }[];
  bitlyAccessToken: string;
}

const data: Data = {
  originalLink: '',
  shortenedLinks: [],
  bitlyAccessToken: '8c7f4236625160f1963c989d7f7ffdb6f960e5ce',
};

const originalLink = ref(data.originalLink);
const shortenedLinks = ref(data.shortenedLinks);
const bitlyAccessToken = ref(data.bitlyAccessToken);

function saveToLocalStorage() {
  localStorage.setItem('shortenedLinks', JSON.stringify(shortenedLinks.value));
}

onMounted(() => {
  const storedHistory = localStorage.getItem('shortenedLinks');
  if (storedHistory) {
    shortenedLinks.value = JSON.parse(storedHistory);
  }
});

async function shortenLink(): Promise<void> {
  try {
    const response = await axios.post(
      'https://api-ssl.bitly.com/v4/shorten',
      {
        long_url: originalLink.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bitlyAccessToken.value}`,
        },
      }
    );

    const shortenedLink = response.data.link;

    shortenedLinks.value.unshift({
      original: originalLink.value,
      shortened: shortenedLink,
      title: ''
    });
    
    originalLink.value = '';

    saveToLocalStorage();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}
function copyToClipboard(link: string): void {
  const textArea = document.createElement('textarea');
  textArea.value = link;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);

  console.log('Link copied to clipboard');
}

function removeLink(index: number): void {
  shortenedLinks.value.splice(index, 1);
}
</script>

<style></style>
