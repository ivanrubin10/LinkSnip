<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <header class="bg-blue-500 text-white p-4 text-center">
      <h1 class="text-3xl font-bold">Link Shortener</h1>
    </header>
    <main class="flex-1 p-4 flex flex-col md:flex-row">
      <section class="shorten-section flex-1 md:mr-4 mb-4 md:mb-0">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">Shorten your link</h2>
        <form @submit.prevent="shortenLink" class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-2">
          <label for="originalLink" class="sr-only">Original Link:</label>
          <input type="url" id="originalLink" v-model="originalLink" required placeholder="Enter your link" class="flex-1 p-3 border border-blue-500 rounded focus:outline-none focus:border-blue-700" />
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700">Shorten</button>
        </form>
      </section>

      <aside class="history-sidebar w-full md:w-1/4 p-4 bg-gray-200">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">Shortened URLs History</h2>
        <ul>
          <li v-for="(shortLink, index) in shortenedLinks" :key="index" class="text-blue-500 hover:underline mb-2">
            <a :href="shortLink.shortened" target="_blank">{{ shortLink.shortened }}</a>
          </li>
        </ul>
      </aside>
    </main>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';

interface Data {
  originalLink: string;
  shortenedLinks: { original: string; shortened: string }[];
  bitlyAccessToken: string;
}

export default defineComponent({
  data(): Data {
    return {
      originalLink: '',
      shortenedLinks: [],
      bitlyAccessToken: '8c7f4236625160f1963c989d7f7ffdb6f960e5ce',
    };
  },
  methods: {
    async shortenLink(this: Data): Promise<void> {
      try {
        const response = await axios.post(
          'https://api-ssl.bitly.com/v4/shorten',
          {
            long_url: this.originalLink,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.bitlyAccessToken}`,
            },
          }
        );

        const shortenedLink = response.data.link;

        this.shortenedLinks.unshift({
          original: this.originalLink,
          shortened: shortenedLink,
        });

        this.originalLink = '';
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    },
    copyToClipboard(shortenedLink: string): void {
      const textArea = document.createElement('textarea');
      textArea.value = shortenedLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      console.log('Link copied to clipboard');
    },
  },
});
</script>


<style></style>
