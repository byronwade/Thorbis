/* global define */

if (!self.define) {
  let currentModuleUrl;
  const moduleRegistry = new Map();

  const loadModule = (moduleName, parentUrl) => {
    const moduleUrl = new URL(`${moduleName}.js`, parentUrl).href;
    if (!moduleRegistry.has(moduleUrl)) {
      const modulePromise = new Promise((resolve) => {
        if ("document" in self) {
          const script = document.createElement("script");
          script.src = moduleUrl;
          script.onload = resolve;
          document.head.appendChild(script);
        } else {
          currentModuleUrl = moduleUrl;
          importScripts(moduleUrl);
          resolve();
        }
      }).then(() => {
        const registeredModule = moduleRegistry.get(moduleUrl);
        if (!registeredModule) {
          throw new Error(`Module ${moduleUrl} didn’t register its module`);
        }
        return registeredModule;
      });
      moduleRegistry.set(moduleUrl, modulePromise);
    }
    return moduleRegistry.get(moduleUrl);
  };

  self.define = (dependencies, factory) => {
    const moduleUrl =
      currentModuleUrl ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;

    if (moduleRegistry.has(moduleUrl)) {
      return;
    }

    const exports = {};
    const require = (dep) => loadModule(dep, moduleUrl);
    const registryEntry = { module: { uri: moduleUrl }, exports, require };

    const dependencyPromises = dependencies.map(
      (dep) => registryEntry[dep] || require(dep)
    );

    moduleRegistry.set(
      moduleUrl,
      Promise.all(dependencyPromises).then((resolvedDeps) => {
        factory(...resolvedDeps);
        return exports;
      })
    );
  };
}

const SUPABASE_REST_REGEX = /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i;
const SUPABASE_AUTH_REGEX = /^https:\/\/.*\.supabase\.co\/auth\/.*/i;
const IMAGE_ASSET_REGEX = /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i;
const SCRIPT_STYLE_REGEX = /\.(?:js|css)$/i;
self.define(["./workbox-173c6b3a"], (a) => {
  importScripts();
  self.skipWaiting();
  a.clientsClaim();
  a.precacheAndRoute(
    [
      {
        url: "/ThorbisLogo.webp",
        revision: "07a21540836e091e6f334bef4a1c70d9",
      },
      {
        url: "/_next/static/ZqVLj3IqaLALtbS_1DkqE/_buildManifest.js",
        revision: "c025aaa5af3cc71310746147b24137db",
      },
      {
        url: "/_next/static/ZqVLj3IqaLALtbS_1DkqE/_ssgManifest.js",
        revision: "b6652df95db52feb4daf4eca35380933",
      },
      {
        url: "/_next/static/chunks/0af3c2ec.04c57843e00da17f.js",
        revision: "04c57843e00da17f",
      },
      {
        url: "/_next/static/chunks/10285.cc65b28ac89f2366.js",
        revision: "cc65b28ac89f2366",
      },
      {
        url: "/_next/static/chunks/10897.b02102c398f4fd6c.js",
        revision: "b02102c398f4fd6c",
      },
      {
        url: "/_next/static/chunks/11342-e2ee7fa304771bd7.js",
        revision: "e2ee7fa304771bd7",
      },
      {
        url: "/_next/static/chunks/11616.274169c6247fd967.js",
        revision: "274169c6247fd967",
      },
      {
        url: "/_next/static/chunks/11988-e50ba5071dca5fa3.js",
        revision: "e50ba5071dca5fa3",
      },
      {
        url: "/_next/static/chunks/12375.54a2d9d4dd7f35e6.js",
        revision: "54a2d9d4dd7f35e6",
      },
      {
        url: "/_next/static/chunks/12552-af8c33448a5dd40b.js",
        revision: "af8c33448a5dd40b",
      },
      {
        url: "/_next/static/chunks/13928-81d5c46603d6f19f.js",
        revision: "81d5c46603d6f19f",
      },
      {
        url: "/_next/static/chunks/14230-fa36dcdce0362c8a.js",
        revision: "fa36dcdce0362c8a",
      },
      {
        url: "/_next/static/chunks/14314-3c7187df3a90729c.js",
        revision: "3c7187df3a90729c",
      },
      {
        url: "/_next/static/chunks/14586-a0d50af285d19351.js",
        revision: "a0d50af285d19351",
      },
      {
        url: "/_next/static/chunks/15383-db658270beac50c9.js",
        revision: "db658270beac50c9",
      },
      {
        url: "/_next/static/chunks/15419-7b4b2520665bff98.js",
        revision: "7b4b2520665bff98",
      },
      {
        url: "/_next/static/chunks/16482-f8c1c973df2d229f.js",
        revision: "f8c1c973df2d229f",
      },
      {
        url: "/_next/static/chunks/16823-60713c0a6ddce97f.js",
        revision: "60713c0a6ddce97f",
      },
      {
        url: "/_next/static/chunks/17246.dd06f5a7ec9af540.js",
        revision: "dd06f5a7ec9af540",
      },
      {
        url: "/_next/static/chunks/1929-b52dc2b7ddf7eb78.js",
        revision: "b52dc2b7ddf7eb78",
      },
      {
        url: "/_next/static/chunks/19517.f3271a60f02c10c1.js",
        revision: "f3271a60f02c10c1",
      },
      {
        url: "/_next/static/chunks/20759-aea9b8642cf842ed.js",
        revision: "aea9b8642cf842ed",
      },
      {
        url: "/_next/static/chunks/2082-27770631fa37168b.js",
        revision: "27770631fa37168b",
      },
      {
        url: "/_next/static/chunks/20972-610fe2f27cc4b75d.js",
        revision: "610fe2f27cc4b75d",
      },
      {
        url: "/_next/static/chunks/21741-1433937b6f8f69c5.js",
        revision: "1433937b6f8f69c5",
      },
      {
        url: "/_next/static/chunks/23923-94bc0362b99bcc48.js",
        revision: "94bc0362b99bcc48",
      },
      {
        url: "/_next/static/chunks/25063.660f40e3c328391e.js",
        revision: "660f40e3c328391e",
      },
      {
        url: "/_next/static/chunks/25551-cfe88896aff6a829.js",
        revision: "cfe88896aff6a829",
      },
      {
        url: "/_next/static/chunks/28281-27267a94902b78fc.js",
        revision: "27267a94902b78fc",
      },
      {
        url: "/_next/static/chunks/2894-a4d3f9cbfd3aa94a.js",
        revision: "a4d3f9cbfd3aa94a",
      },
      {
        url: "/_next/static/chunks/29062-bac4831f73a1407e.js",
        revision: "bac4831f73a1407e",
      },
      {
        url: "/_next/static/chunks/29798-bb0f625c3a6395f3.js",
        revision: "bb0f625c3a6395f3",
      },
      {
        url: "/_next/static/chunks/30406-9d0023303c1085d3.js",
        revision: "9d0023303c1085d3",
      },
      {
        url: "/_next/static/chunks/31309-3ff7e437f78600a9.js",
        revision: "3ff7e437f78600a9",
      },
      {
        url: "/_next/static/chunks/32038-0caadf0bc063a63f.js",
        revision: "0caadf0bc063a63f",
      },
      {
        url: "/_next/static/chunks/32708-19d9dcb42d5cf69a.js",
        revision: "19d9dcb42d5cf69a",
      },
      {
        url: "/_next/static/chunks/33243.a88c1c05420682e6.js",
        revision: "a88c1c05420682e6",
      },
      {
        url: "/_next/static/chunks/34615-e694ffdc0f53257e.js",
        revision: "e694ffdc0f53257e",
      },
      {
        url: "/_next/static/chunks/35601-6ddc7745c5a6cc3d.js",
        revision: "6ddc7745c5a6cc3d",
      },
      {
        url: "/_next/static/chunks/35687-afef5d27747ae3c7.js",
        revision: "afef5d27747ae3c7",
      },
      {
        url: "/_next/static/chunks/36476-f8a6068631bac7da.js",
        revision: "f8a6068631bac7da",
      },
      {
        url: "/_next/static/chunks/37968-21265fc4482d2103.js",
        revision: "21265fc4482d2103",
      },
      {
        url: "/_next/static/chunks/3823-8f6a0db91e2e9d27.js",
        revision: "8f6a0db91e2e9d27",
      },
      {
        url: "/_next/static/chunks/38463.8df92cde2cacc73e.js",
        revision: "8df92cde2cacc73e",
      },
      {
        url: "/_next/static/chunks/39230-42654fe3c7babff1.js",
        revision: "42654fe3c7babff1",
      },
      {
        url: "/_next/static/chunks/39247-1fbfabe7a8e039c5.js",
        revision: "1fbfabe7a8e039c5",
      },
      {
        url: "/_next/static/chunks/39443-9e89a35e60186d34.js",
        revision: "9e89a35e60186d34",
      },
      {
        url: "/_next/static/chunks/3b42e7c7.99576e58f26b16d1.js",
        revision: "99576e58f26b16d1",
      },
      {
        url: "/_next/static/chunks/40366-2afa7b60ce07e89e.js",
        revision: "2afa7b60ce07e89e",
      },
      {
        url: "/_next/static/chunks/40841.d79b4772b6710c28.js",
        revision: "d79b4772b6710c28",
      },
      {
        url: "/_next/static/chunks/41161.ab20f0ec96287175.js",
        revision: "ab20f0ec96287175",
      },
      {
        url: "/_next/static/chunks/42074-163dbddff36ccef8.js",
        revision: "163dbddff36ccef8",
      },
      {
        url: "/_next/static/chunks/42120-13fd42ee3c0f5249.js",
        revision: "13fd42ee3c0f5249",
      },
      {
        url: "/_next/static/chunks/42163-9586616d1762a346.js",
        revision: "9586616d1762a346",
      },
      {
        url: "/_next/static/chunks/43283-a3273402e96dd861.js",
        revision: "a3273402e96dd861",
      },
      {
        url: "/_next/static/chunks/434-fd0929472bd16928.js",
        revision: "fd0929472bd16928",
      },
      {
        url: "/_next/static/chunks/43962-a412dab8a564c8d9.js",
        revision: "a412dab8a564c8d9",
      },
      {
        url: "/_next/static/chunks/45054-5f2b25fc2df9dc7b.js",
        revision: "5f2b25fc2df9dc7b",
      },
      {
        url: "/_next/static/chunks/46721-85daad15215e7f79.js",
        revision: "85daad15215e7f79",
      },
      {
        url: "/_next/static/chunks/48588-35d20a904263e512.js",
        revision: "35d20a904263e512",
      },
      {
        url: "/_next/static/chunks/48881.25d7eb80cf62775e.js",
        revision: "25d7eb80cf62775e",
      },
      {
        url: "/_next/static/chunks/50084-b80d777070786517.js",
        revision: "b80d777070786517",
      },
      {
        url: "/_next/static/chunks/50136-5aa0f4e30bf58cae.js",
        revision: "5aa0f4e30bf58cae",
      },
      {
        url: "/_next/static/chunks/50966-4eeb983c49444153.js",
        revision: "4eeb983c49444153",
      },
      {
        url: "/_next/static/chunks/51169-9d1c2ecded462413.js",
        revision: "9d1c2ecded462413",
      },
      {
        url: "/_next/static/chunks/51806-b53d721610b60915.js",
        revision: "b53d721610b60915",
      },
      {
        url: "/_next/static/chunks/51891.3efc2fd243cbf3cd.js",
        revision: "3efc2fd243cbf3cd",
      },
      {
        url: "/_next/static/chunks/51942-ca067891e50a3cc2.js",
        revision: "ca067891e50a3cc2",
      },
      {
        url: "/_next/static/chunks/52117-a92aec9ad191a92e.js",
        revision: "a92aec9ad191a92e",
      },
      {
        url: "/_next/static/chunks/52233-afa2d8008171e85d.js",
        revision: "afa2d8008171e85d",
      },
      {
        url: "/_next/static/chunks/52318-39a76f760130f46c.js",
        revision: "39a76f760130f46c",
      },
      {
        url: "/_next/static/chunks/533-2f2aef93e1cd9c90.js",
        revision: "2f2aef93e1cd9c90",
      },
      {
        url: "/_next/static/chunks/53462.28ea1ee896229df5.js",
        revision: "28ea1ee896229df5",
      },
      {
        url: "/_next/static/chunks/53936-752fc233e9a2f238.js",
        revision: "752fc233e9a2f238",
      },
      {
        url: "/_next/static/chunks/54048-eaa58a698020cf5c.js",
        revision: "eaa58a698020cf5c",
      },
      {
        url: "/_next/static/chunks/54387-512188c7bd288f01.js",
        revision: "512188c7bd288f01",
      },
      {
        url: "/_next/static/chunks/54693-9f2a5e89e93c5c0c.js",
        revision: "9f2a5e89e93c5c0c",
      },
      {
        url: "/_next/static/chunks/55354-db29d73083d55a7a.js",
        revision: "db29d73083d55a7a",
      },
      {
        url: "/_next/static/chunks/5571-c1dd18977cb48195.js",
        revision: "c1dd18977cb48195",
      },
      {
        url: "/_next/static/chunks/55996-c56a17aa06f97746.js",
        revision: "c56a17aa06f97746",
      },
      {
        url: "/_next/static/chunks/56038-e39a232733e0c494.js",
        revision: "e39a232733e0c494",
      },
      {
        url: "/_next/static/chunks/5624-0aeb73acea10a520.js",
        revision: "0aeb73acea10a520",
      },
      {
        url: "/_next/static/chunks/56288-031a0abf3ffac37c.js",
        revision: "031a0abf3ffac37c",
      },
      {
        url: "/_next/static/chunks/56510.8681222cd2ba4769.js",
        revision: "8681222cd2ba4769",
      },
      {
        url: "/_next/static/chunks/56795-a1b564c589cada10.js",
        revision: "a1b564c589cada10",
      },
      {
        url: "/_next/static/chunks/57203-737f6eaf2009cee6.js",
        revision: "737f6eaf2009cee6",
      },
      {
        url: "/_next/static/chunks/57478-b7daab5f408df17e.js",
        revision: "b7daab5f408df17e",
      },
      {
        url: "/_next/static/chunks/57554-45e22a75b0b27de3.js",
        revision: "45e22a75b0b27de3",
      },
      {
        url: "/_next/static/chunks/57679-3e0995bcab923930.js",
        revision: "3e0995bcab923930",
      },
      {
        url: "/_next/static/chunks/58143-d1f8db4cf367b1c1.js",
        revision: "d1f8db4cf367b1c1",
      },
      {
        url: "/_next/static/chunks/59659-05acabcc581d8221.js",
        revision: "05acabcc581d8221",
      },
      {
        url: "/_next/static/chunks/60166-55153fe345cdce27.js",
        revision: "55153fe345cdce27",
      },
      {
        url: "/_next/static/chunks/60733-bbc86692d8285684.js",
        revision: "bbc86692d8285684",
      },
      {
        url: "/_next/static/chunks/62376-754a66b58c371169.js",
        revision: "754a66b58c371169",
      },
      {
        url: "/_next/static/chunks/62445-5e84a6083137bf08.js",
        revision: "5e84a6083137bf08",
      },
      {
        url: "/_next/static/chunks/62894-02293275ddab5990.js",
        revision: "02293275ddab5990",
      },
      {
        url: "/_next/static/chunks/62934-67e09425d104694e.js",
        revision: "67e09425d104694e",
      },
      {
        url: "/_next/static/chunks/63468-1c63206dbe661dc3.js",
        revision: "1c63206dbe661dc3",
      },
      {
        url: "/_next/static/chunks/63634-331606c7ff32545e.js",
        revision: "331606c7ff32545e",
      },
      {
        url: "/_next/static/chunks/64055.6bb2e8f50494d096.js",
        revision: "6bb2e8f50494d096",
      },
      {
        url: "/_next/static/chunks/66709.8962395e1d4a2743.js",
        revision: "8962395e1d4a2743",
      },
      {
        url: "/_next/static/chunks/66805.5de1ac79a1870095.js",
        revision: "5de1ac79a1870095",
      },
      {
        url: "/_next/static/chunks/67079-97c555be425812a0.js",
        revision: "97c555be425812a0",
      },
      {
        url: "/_next/static/chunks/70447.fa23820c4faba9bd.js",
        revision: "fa23820c4faba9bd",
      },
      {
        url: "/_next/static/chunks/70687-94278c33202eed16.js",
        revision: "94278c33202eed16",
      },
      {
        url: "/_next/static/chunks/72260-17f9b5d3ef956289.js",
        revision: "17f9b5d3ef956289",
      },
      {
        url: "/_next/static/chunks/74181-5b9b847ddcc08fa6.js",
        revision: "5b9b847ddcc08fa6",
      },
      {
        url: "/_next/static/chunks/74272.04839fda97094536.js",
        revision: "04839fda97094536",
      },
      {
        url: "/_next/static/chunks/75481-169b7e188c28b299.js",
        revision: "169b7e188c28b299",
      },
      {
        url: "/_next/static/chunks/7553-164def33d87a5dc7.js",
        revision: "164def33d87a5dc7",
      },
      {
        url: "/_next/static/chunks/75712-f55f62cc06662751.js",
        revision: "f55f62cc06662751",
      },
      {
        url: "/_next/static/chunks/76021-329d061cb3c26a28.js",
        revision: "329d061cb3c26a28",
      },
      {
        url: "/_next/static/chunks/76313-476c7d61e9154754.js",
        revision: "476c7d61e9154754",
      },
      {
        url: "/_next/static/chunks/78153-ff68ea48a08d18b0.js",
        revision: "ff68ea48a08d18b0",
      },
      {
        url: "/_next/static/chunks/79019-badfb9cdb279668c.js",
        revision: "badfb9cdb279668c",
      },
      {
        url: "/_next/static/chunks/79122-1c673428f7347ff5.js",
        revision: "1c673428f7347ff5",
      },
      {
        url: "/_next/static/chunks/80010-646a1dfd6c92e191.js",
        revision: "646a1dfd6c92e191",
      },
      {
        url: "/_next/static/chunks/8048-f4104b7dfd9585ad.js",
        revision: "f4104b7dfd9585ad",
      },
      {
        url: "/_next/static/chunks/81200-8b5fe99c45980d4e.js",
        revision: "8b5fe99c45980d4e",
      },
      {
        url: "/_next/static/chunks/81672-5db91bd2d83a9a04.js",
        revision: "5db91bd2d83a9a04",
      },
      {
        url: "/_next/static/chunks/82427-493d19966b17de99.js",
        revision: "493d19966b17de99",
      },
      {
        url: "/_next/static/chunks/82450-52a9c1b7aa16d0c9.js",
        revision: "52a9c1b7aa16d0c9",
      },
      {
        url: "/_next/static/chunks/82688-1fc134d3ab7e931e.js",
        revision: "1fc134d3ab7e931e",
      },
      {
        url: "/_next/static/chunks/83114-bbc86692d8285684.js",
        revision: "bbc86692d8285684",
      },
      {
        url: "/_next/static/chunks/84669-eabe457cd22ee5ac.js",
        revision: "eabe457cd22ee5ac",
      },
      {
        url: "/_next/static/chunks/84747-572b872b0640f5f9.js",
        revision: "572b872b0640f5f9",
      },
      {
        url: "/_next/static/chunks/8520.657ba84461b643e8.js",
        revision: "657ba84461b643e8",
      },
      {
        url: "/_next/static/chunks/85642-6a6e38ac104445db.js",
        revision: "6a6e38ac104445db",
      },
      {
        url: "/_next/static/chunks/85812-17567f12a304d93c.js",
        revision: "17567f12a304d93c",
      },
      {
        url: "/_next/static/chunks/868.89d45c214351aa26.js",
        revision: "89d45c214351aa26",
      },
      {
        url: "/_next/static/chunks/87197-8719332f0f8d6d22.js",
        revision: "8719332f0f8d6d22",
      },
      {
        url: "/_next/static/chunks/87843-bd6d22307ea1deab.js",
        revision: "bd6d22307ea1deab",
      },
      {
        url: "/_next/static/chunks/88040-8b61970dfafafde6.js",
        revision: "8b61970dfafafde6",
      },
      {
        url: "/_next/static/chunks/88828-434f5acedc1b38c3.js",
        revision: "434f5acedc1b38c3",
      },
      {
        url: "/_next/static/chunks/89365-1d7aabfdb58fb328.js",
        revision: "1d7aabfdb58fb328",
      },
      {
        url: "/_next/static/chunks/89642-ca10bea951218765.js",
        revision: "ca10bea951218765",
      },
      {
        url: "/_next/static/chunks/89699-c165eeb81fe7de3f.js",
        revision: "c165eeb81fe7de3f",
      },
      {
        url: "/_next/static/chunks/90055-7f31da5e95bc8c95.js",
        revision: "7f31da5e95bc8c95",
      },
      {
        url: "/_next/static/chunks/90100-1409dfcee745d4a4.js",
        revision: "1409dfcee745d4a4",
      },
      {
        url: "/_next/static/chunks/9042-33b7867ef3bae3fe.js",
        revision: "33b7867ef3bae3fe",
      },
      {
        url: "/_next/static/chunks/90477-13a29c85597fc056.js",
        revision: "13a29c85597fc056",
      },
      {
        url: "/_next/static/chunks/91162-17023726dce7dcd2.js",
        revision: "17023726dce7dcd2",
      },
      {
        url: "/_next/static/chunks/91395-9f1ca483e160efb4.js",
        revision: "9f1ca483e160efb4",
      },
      {
        url: "/_next/static/chunks/91522-818a5a4d9ae027aa.js",
        revision: "818a5a4d9ae027aa",
      },
      {
        url: "/_next/static/chunks/93263-50abb728e0295c1a.js",
        revision: "50abb728e0295c1a",
      },
      {
        url: "/_next/static/chunks/93774-50f44ccccf675dd0.js",
        revision: "50f44ccccf675dd0",
      },
      {
        url: "/_next/static/chunks/94887-18ab70dddc78a3f9.js",
        revision: "18ab70dddc78a3f9",
      },
      {
        url: "/_next/static/chunks/95056-fb6b9340e247f9e1.js",
        revision: "fb6b9340e247f9e1",
      },
      {
        url: "/_next/static/chunks/95208-a582b5e82602b19d.js",
        revision: "a582b5e82602b19d",
      },
      {
        url: "/_next/static/chunks/96668-e0c33a77cbfd7e6c.js",
        revision: "e0c33a77cbfd7e6c",
      },
      {
        url: "/_next/static/chunks/96745.1d9047cb13c8fa01.js",
        revision: "1d9047cb13c8fa01",
      },
      {
        url: "/_next/static/chunks/97049.27d764ca2f332f64.js",
        revision: "27d764ca2f332f64",
      },
      {
        url: "/_next/static/chunks/97109-89ab2f10d54f3fb2.js",
        revision: "89ab2f10d54f3fb2",
      },
      {
        url: "/_next/static/chunks/9721.af52b9ecbe8fe4db.js",
        revision: "af52b9ecbe8fe4db",
      },
      {
        url: "/_next/static/chunks/97236-2182fe7f93bd7d11.js",
        revision: "2182fe7f93bd7d11",
      },
      {
        url: "/_next/static/chunks/9758-409f5d1f4531fc18.js",
        revision: "409f5d1f4531fc18",
      },
      {
        url: "/_next/static/chunks/97583-91763737c44c9b23.js",
        revision: "91763737c44c9b23",
      },
      {
        url: "/_next/static/chunks/99412-7979c5a9c67fe882.js",
        revision: "7979c5a9c67fe882",
      },
      {
        url: "/_next/static/chunks/af5d595a-08da3a2f80035cc4.js",
        revision: "08da3a2f80035cc4",
      },
      {
        url: "/_next/static/chunks/af902724-1952db88b02a3eb3.js",
        revision: "1952db88b02a3eb3",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/admin/update-address/page-126a9248c9f90f2a.js",
        revision: "126a9248c9f90f2a",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/ai/automation/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/ai/page-6fff047005211ab7.js",
        revision: "6fff047005211ab7",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/analytics/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/automation/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/coming-soon/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/communication/%5Bid%5D/page-329381e087623c60.js",
        revision: "329381e087623c60",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/communication/archive/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/communication/feed/page-751ef7f426f046a7.js",
        revision: "751ef7f426f046a7",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/communication/page-82b1c001f8d5384d.js",
        revision: "82b1c001f8d5384d",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/communication/spam/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/communication/starred/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/communication/teams/general/page-27a88c8693d57253.js",
        revision: "27a88c8693d57253",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/communication/teams/management/page-27a88c8693d57253.js",
        revision: "27a88c8693d57253",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/communication/teams/sales/page-27a88c8693d57253.js",
        revision: "27a88c8693d57253",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/communication/teams/support/page-27a88c8693d57253.js",
        revision: "27a88c8693d57253",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/communication/teams/technicians/page-27a88c8693d57253.js",
        revision: "27a88c8693d57253",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/communication/trash/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/communication/unread/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/customers/%5Bid%5D/edit/page-062a1d9f9d2fd983.js",
        revision: "062a1d9f9d2fd983",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/customers/%5Bid%5D/page-76df9fe0e11305c3.js",
        revision: "76df9fe0e11305c3",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/customers/communication/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/customers/error-cdaeaf93938951ce.js",
        revision: "cdaeaf93938951ce",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/customers/history/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/customers/loading-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/customers/new/page-cf872e26f3bd490c.js",
        revision: "cf872e26f3bd490c",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/customers/page-8f519bb0b4b2807c.js",
        revision: "8f519bb0b4b2807c",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/customers/portal/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/customers/profiles/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/error-3416e2f7341bb8cd.js",
        revision: "3416e2f7341bb8cd",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/accounting/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/accounts-payable/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/accounts-receivable/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/bank-reconciliation/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/bookkeeping/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/budget/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/business-financing/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/cash-flow/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/chart-of-accounts/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/consumer-financing/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/credit-cards/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/debit-cards/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/estimates/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/expenses/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/general-ledger/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/invoicing/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/journal-entries/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/page-dc60327dc363ffa6.js",
        revision: "dc60327dc363ffa6",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/payments/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/payroll/employees/page-f12e3b186653ab07.js",
        revision: "f12e3b186653ab07",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/payroll/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/payroll/pay-runs/page-576a79a96c0aae80.js",
        revision: "576a79a96c0aae80",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/payroll/reports/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/payroll/settings/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/payroll/time-tracking/page-f12e3b186653ab07.js",
        revision: "f12e3b186653ab07",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/quickbooks/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/reports/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finance/tax/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/finances/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/inventory/alerts/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/inventory/analytics/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/inventory/assets/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/inventory/equipment/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/inventory/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/inventory/parts/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/inventory/purchase-orders/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/inventory/reports/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/inventory/stock/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/inventory/vendors/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/invoices/create/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/invoices/estimates/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/invoices/page-6d123d4b7a1f4540.js",
        revision: "6d123d4b7a1f4540",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/invoices/pending/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/jobs/history/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/jobs/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/jobs/status/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/jobs/templates/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/jobs/work-orders/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/loading-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/marketing/analytics/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/marketing/booking/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/marketing/call-logs/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/marketing/campaigns/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/marketing/email-marketing/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/marketing/email/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/marketing/lead-tracking/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/marketing/leads/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/marketing/outreach/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/marketing/page-60cf85c5c54c25da.js",
        revision: "60cf85c5c54c25da",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/marketing/referrals/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/marketing/reviews/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/marketing/sms-campaigns/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/marketing/sms/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/marketing/voicemail/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/marketing/voip/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/notifications/page-1fd883f58c6d51d1.js",
        revision: "1fd883f58c6d51d1",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/operations/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/page-9cf95b91e7192162.js",
        revision: "9cf95b91e7192162",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/pricebook/analytics/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/pricebook/customers/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/pricebook/equipment/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/pricebook/history/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/pricebook/labor/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/pricebook/packages/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/pricebook/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/pricebook/parts/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/pricebook/rules/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/pricebook/seasonal/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/pricebook/services/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/pricebook/travel/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/properties/%5Bid%5D/edit/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/properties/%5Bid%5D/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/properties/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/reporting/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/reports/builder/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/reports/custom/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/reports/customers/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/reports/error-a124f6cdb2645404.js",
        revision: "a124f6cdb2645404",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/reports/export/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/reports/financial/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/reports/jobs/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/reports/loading-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/reports/operational/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/reports/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/reports/performance/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/reports/scheduled/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/reports/technicians/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/reports/visualization/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/scheduling/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/archive/page-e4e7c74b2458d846.js",
        revision: "e4e7c74b2458d846",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/automation/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/billing/page-267b346a69fda85b.js",
        revision: "267b346a69fda85b",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/billing/payment-methods/page-04acb221116819d8.js",
        revision: "04acb221116819d8",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/booking/page-2080f133198ed071.js",
        revision: "2080f133198ed071",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/checklists/page-d7ac3c15ff6f6b56.js",
        revision: "d7ac3c15ff6f6b56",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/communications/call-routing/page-38106478870a3d76.js",
        revision: "38106478870a3d76",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/communications/email-templates/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/communications/email/page-0f2b119b0fefe43c.js",
        revision: "0f2b119b0fefe43c",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/communications/ivr-menus/page-c7b5f394adc1bb02.js",
        revision: "c7b5f394adc1bb02",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/communications/notifications/page-879054c010fc5f42.js",
        revision: "879054c010fc5f42",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/communications/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/communications/phone-numbers/page-20c7e1ed01c0c9db.js",
        revision: "20c7e1ed01c0c9db",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/communications/phone/page-2c08c5b436a2f344.js",
        revision: "2c08c5b436a2f344",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/communications/porting-status/page-b55abded5affdbaa.js",
        revision: "b55abded5affdbaa",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/communications/sms/page-8e9dccec1b9629e9.js",
        revision: "8e9dccec1b9629e9",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/communications/templates/page-0dd7afa8284334b3.js",
        revision: "0dd7afa8284334b3",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/communications/usage/page-540f415ca57e1c79.js",
        revision: "540f415ca57e1c79",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/communications/voicemail/page-260f9c19d5979645.js",
        revision: "260f9c19d5979645",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/company-feed/page-5abe8dbce62e43d8.js",
        revision: "5abe8dbce62e43d8",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/company/page-f4162a4164caa037.js",
        revision: "f4162a4164caa037",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/customer-intake/page-28806b56db730bb9.js",
        revision: "28806b56db730bb9",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/customer-portal/page-dc2775b37b332649.js",
        revision: "dc2775b37b332649",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/customers/custom-fields/page-3344b45b3a96ee93.js",
        revision: "3344b45b3a96ee93",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/customers/loyalty/page-41acdd04f46654cc.js",
        revision: "41acdd04f46654cc",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/customers/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/customers/preferences/page-3beca6f32f272625.js",
        revision: "3beca6f32f272625",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/customers/privacy/page-2392164bc3648812.js",
        revision: "2392164bc3648812",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/data-import-export/page-1c32f9d461a0237e.js",
        revision: "1c32f9d461a0237e",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/development/page-dd0edc49bad336c9.js",
        revision: "dd0edc49bad336c9",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/error-1643bceb31252db4.js",
        revision: "1643bceb31252db4",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/estimates/page-1a8ea5180fe0137f.js",
        revision: "1a8ea5180fe0137f",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/finance/accounting/page-04b186e2c5599b79.js",
        revision: "04b186e2c5599b79",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/finance/bank-accounts/page-390f2596f9b4a69a.js",
        revision: "390f2596f9b4a69a",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/finance/bookkeeping/page-d43ac96d0afd24e8.js",
        revision: "d43ac96d0afd24e8",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/finance/business-financing/page-6986f7cbca1caee9.js",
        revision: "6986f7cbca1caee9",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/finance/consumer-financing/page-9acb9b783235e354.js",
        revision: "9acb9b783235e354",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/finance/debit-cards/page-d960b434748435a2.js",
        revision: "d960b434748435a2",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/finance/gas-cards/page-1815c489fe6df9ce.js",
        revision: "1815c489fe6df9ce",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/finance/gift-cards/page-a64e1dadcaf114a8.js",
        revision: "a64e1dadcaf114a8",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/finance/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/finance/virtual-buckets/page-b9d62a6e4a53daed.js",
        revision: "b9d62a6e4a53daed",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/integrations/%5Bid%5D/page-e64e8a26f3051e33.js",
        revision: "e64e8a26f3051e33",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/integrations/page-d4ffdc6e6b3eb2b0.js",
        revision: "d4ffdc6e6b3eb2b0",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/invoices/page-98c287953f528a85.js",
        revision: "98c287953f528a85",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/job-fields/page-73bfd9369ff49d38.js",
        revision: "73bfd9369ff49d38",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/jobs/page-ea7c9f6816a6c6f2.js",
        revision: "ea7c9f6816a6c6f2",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/lead-sources/page-e127fcca45bff59a.js",
        revision: "e127fcca45bff59a",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/loading-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/marketing/page-872435348a12c90b.js",
        revision: "872435348a12c90b",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/page-6c5d259b09746fb0.js",
        revision: "6c5d259b09746fb0",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/payroll/bonuses/page-0cec051ecc7bbd72.js",
        revision: "0cec051ecc7bbd72",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/payroll/callbacks/page-13cf1072b7f08806.js",
        revision: "13cf1072b7f08806",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/payroll/commission/page-8395eb28211d1816.js",
        revision: "8395eb28211d1816",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/payroll/deductions/page-8e46f0ba998cb249.js",
        revision: "8e46f0ba998cb249",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/payroll/materials/page-3c32b0766de92861.js",
        revision: "3c32b0766de92861",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/payroll/overtime/page-592692bb6294ea4d.js",
        revision: "592692bb6294ea4d",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/payroll/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/payroll/schedule/page-d01550ecf4a57fb8.js",
        revision: "d01550ecf4a57fb8",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/pricebook/integrations/page-d349d10e0a994bc4.js",
        revision: "d349d10e0a994bc4",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/pricebook/page-66552ff87d239674.js",
        revision: "66552ff87d239674",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/profile/notifications/email/page-13d1b40f12c5b7ea.js",
        revision: "13d1b40f12c5b7ea",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/profile/notifications/page-d7166cd18ed879fd.js",
        revision: "d7166cd18ed879fd",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/profile/notifications/push/page-00df49929a6788b3.js",
        revision: "00df49929a6788b3",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/profile/personal/page-eeeb66c11a89936a.js",
        revision: "eeeb66c11a89936a",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/profile/preferences/page-9acfe0f6cd38f50f.js",
        revision: "9acfe0f6cd38f50f",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/profile/security/2fa/page-d180146d476c93d6.js",
        revision: "d180146d476c93d6",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/profile/security/page-f3eedaf005d13d4f.js",
        revision: "f3eedaf005d13d4f",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/profile/security/password/page-4eeffa6cf71fd73f.js",
        revision: "4eeffa6cf71fd73f",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/purchase-orders/page-759ad5bb43f52416.js",
        revision: "759ad5bb43f52416",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/reporting/page-caf4def6d474abe9.js",
        revision: "caf4def6d474abe9",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/schedule/availability/page-3476c4ea40fe0a9b.js",
        revision: "3476c4ea40fe0a9b",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/schedule/calendar/page-b40a95f14c3ca2bf.js",
        revision: "b40a95f14c3ca2bf",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/schedule/dispatch-rules/page-8bac2dd5a374ea7a.js",
        revision: "8bac2dd5a374ea7a",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/schedule/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/schedule/service-areas/page-ce307891f702fa99.js",
        revision: "ce307891f702fa99",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/schedule/team-scheduling/page-98c997e4c61b457e.js",
        revision: "98c997e4c61b457e",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/service-plans/page-669f1156ddb09507.js",
        revision: "669f1156ddb09507",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/subscriptions/page-75e6b38c1443ddfa.js",
        revision: "75e6b38c1443ddfa",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/tags/page-df141e59463f9f20.js",
        revision: "df141e59463f9f20",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/team/%5Bid%5D/page-47986cbbb5153022.js",
        revision: "47986cbbb5153022",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/team/departments/page-2c3d98389a2d02c9.js",
        revision: "2c3d98389a2d02c9",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/team/invite/page-d0f1b7f0ce092634.js",
        revision: "d0f1b7f0ce092634",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/team/page-a762446b638ccbf7.js",
        revision: "a762446b638ccbf7",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/team/roles/%5Bid%5D/page-79795c32fd284b02.js",
        revision: "79795c32fd284b02",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/team/roles/page-b2c533cfbe6ad34a.js",
        revision: "b2c533cfbe6ad34a",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/settings/tv/page-dde3aff8a444e0a0.js",
        revision: "dde3aff8a444e0a0",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/shop/%5Bid%5D/page-eb0c3daf187c8d71.js",
        revision: "eb0c3daf187c8d71",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/shop/page-915a1f0b1909339b.js",
        revision: "915a1f0b1909339b",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/technicians/analytics/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/technicians/app/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/technicians/attendance/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/technicians/equipment/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/technicians/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/technicians/payroll/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/technicians/performance/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/technicians/profiles/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/technicians/skills/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/technicians/training/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/test-full-width/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/test-layout/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/training/assessments/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/training/certifications/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/training/compliance/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/training/courses/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/training/learning/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/training/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/training/progress/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/training/reports/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/training/schedules/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/tv/page-3171f9673870f469.js",
        revision: "3171f9673870f469",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/welcome/page-5478598c5f87fa4f.js",
        revision: "5478598c5f87fa4f",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/%5Bid%5D/edit/page-55215236b7b1fd4c.js",
        revision: "55215236b7b1fd4c",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/%5Bid%5D/page-8dd2a53999d7e837.js",
        revision: "8dd2a53999d7e837",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/contracts/%5Bid%5D/page-4ad065f04da6a1e4.js",
        revision: "4ad065f04da6a1e4",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/contracts/new/page-5eba330b8f2b8938.js",
        revision: "5eba330b8f2b8938",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/contracts/page-ff975173ea0e37b8.js",
        revision: "ff975173ea0e37b8",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/contracts/templates/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/equipment/page-be41fbf684da099c.js",
        revision: "be41fbf684da099c",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/error-7f55f22754f236f6.js",
        revision: "7f55f22754f236f6",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/estimates/page-5fcc2b429b54def0.js",
        revision: "5fcc2b429b54def0",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/invoices/%5Bid%5D/page-648d304517009fb6.js",
        revision: "648d304517009fb6",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/invoices/page-c3c9c9a1ba15e0ab.js",
        revision: "c3c9c9a1ba15e0ab",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/loading-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/maintenance-plans/page-6e75eac7e3850652.js",
        revision: "6e75eac7e3850652",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/materials/page-b02816010b33f61c.js",
        revision: "b02816010b33f61c",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/new/page-4fcea40ef2b1c38b.js",
        revision: "4fcea40ef2b1c38b",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/page-e4653eb12bf4a28a.js",
        revision: "e4653eb12bf4a28a",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/pricebook/%5Bid%5D/page-e9b8e6f30675f5d8.js",
        revision: "e9b8e6f30675f5d8",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/pricebook/c/%5B...slug%5D/page-d54e47236820389f.js",
        revision: "d54e47236820389f",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/pricebook/export/page-e57c983c71aab63f.js",
        revision: "e57c983c71aab63f",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/pricebook/import/page-89024e279de915ff.js",
        revision: "89024e279de915ff",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/pricebook/mass-update/page-3722f3eaac15dfa3.js",
        revision: "3722f3eaac15dfa3",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/pricebook/new/page-4b6b52590d8eaa6a.js",
        revision: "4b6b52590d8eaa6a",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/pricebook/page-b39621a109a3a777.js",
        revision: "b39621a109a3a777",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/pricebook/suppliers/%5BsupplierId%5D/page-dc60327dc363ffa6.js",
        revision: "dc60327dc363ffa6",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/purchase-orders/%5Bid%5D/page-6c0afd3bd5b2d3b5.js",
        revision: "6c0afd3bd5b2d3b5",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/purchase-orders/page-b7e40fa12cbfbc0a.js",
        revision: "b7e40fa12cbfbc0a",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/schedule/assignments/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/schedule/availability/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/schedule/dispatch/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/schedule/page-3c707ee6df58e679.js",
        revision: "3c707ee6df58e679",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/schedule/technicians/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/dashboard/work/service-agreements/page-12126cb1b7d8c95e.js",
        revision: "12126cb1b7d8c95e",
      },
      {
        url: "/_next/static/chunks/app/(dashboard)/layout-56d021bc4f55758b.js",
        revision: "56d021bc4f55758b",
      },
      {
        url: "/_next/static/chunks/app/(marketing)/contracts/sign/%5Bid%5D/page-3a6d7e5149c9f94f.js",
        revision: "3a6d7e5149c9f94f",
      },
      {
        url: "/_next/static/chunks/app/(marketing)/contracts/sign/%5Bid%5D/success/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/app/(marketing)/error-315ae2a46b5d37f7.js",
        revision: "315ae2a46b5d37f7",
      },
      {
        url: "/_next/static/chunks/app/(marketing)/kb/%5Bcategory%5D/%5Bslug%5D/page-bbb802dc61641c38.js",
        revision: "bbb802dc61641c38",
      },
      {
        url: "/_next/static/chunks/app/(marketing)/kb/%5Bcategory%5D/page-67279551065b4336.js",
        revision: "67279551065b4336",
      },
      {
        url: "/_next/static/chunks/app/(marketing)/kb/layout-12f467edcc7082e1.js",
        revision: "12f467edcc7082e1",
      },
      {
        url: "/_next/static/chunks/app/(marketing)/kb/page-12c8cd31be964e63.js",
        revision: "12c8cd31be964e63",
      },
      {
        url: "/_next/static/chunks/app/(marketing)/kb/search/page-d362b97772208205.js",
        revision: "d362b97772208205",
      },
      {
        url: "/_next/static/chunks/app/(marketing)/kb/sitemap.xml/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(marketing)/layout-0b4106df2cc9d3a8.js",
        revision: "0b4106df2cc9d3a8",
      },
      {
        url: "/_next/static/chunks/app/(marketing)/loading-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/(marketing)/login/page-ef3fb67c2f025911.js",
        revision: "ef3fb67c2f025911",
      },
      {
        url: "/_next/static/chunks/app/(marketing)/page-915a1f0b1909339b.js",
        revision: "915a1f0b1909339b",
      },
      {
        url: "/_next/static/chunks/app/(marketing)/pricing/page-e22319a3eecfc9d3.js",
        revision: "e22319a3eecfc9d3",
      },
      {
        url: "/_next/static/chunks/app/(marketing)/register/page-86d725cb322423d5.js",
        revision: "86d725cb322423d5",
      },
      {
        url: "/_next/static/chunks/app/_global-error/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/_not-found/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/admin/setup-test-company/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/admin/setup-with-service-role/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/admin/update-byron-address/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/ai/chat/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/ai/workflows/code-review/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/ai/workflows/content/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/chat/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/check-onboarding-status/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/customers/%5Bid%5D/enrich/refresh/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/customers/%5Bid%5D/enrich/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/documents/%5Bid%5D/download/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/documents/upload/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/enrichment/usage/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/get-current-user-info/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/get-incomplete-company/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/get-user-companies/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/invoices/%5Bid%5D/pdf/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/jobs/%5Bid%5D/toolbar-data/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/payments/create-intent/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/payments/methods/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/payments/primary-customer/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/payments/save-method/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/webhooks/assemblyai/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/webhooks/stripe/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/api/webhooks/telnyx/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/auth/callback/route-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/auth/verify-email/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/call-window/page-32a0e4ec46e8fedd.js",
        revision: "32a0e4ec46e8fedd",
      },
      {
        url: "/_next/static/chunks/app/emails/preview/%5Btemplate%5D/page-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/app/error-bce4e13a98720260.js",
        revision: "bce4e13a98720260",
      },
      {
        url: "/_next/static/chunks/app/layout-0979ba43659cb620.js",
        revision: "0979ba43659cb620",
      },
      {
        url: "/_next/static/chunks/app/not-found-f28c36ecf17bce5d.js",
        revision: "f28c36ecf17bce5d",
      },
      {
        url: "/_next/static/chunks/app/portal/setup/page-fd9b8b99032d477d.js",
        revision: "fd9b8b99032d477d",
      },
      {
        url: "/_next/static/chunks/app/test-auth/page-4669ba417d9e3b49.js",
        revision: "4669ba417d9e3b49",
      },
      {
        url: "/_next/static/chunks/app/tools/calculators/break-even/page-f501b56ebc2408ec.js",
        revision: "f501b56ebc2408ec",
      },
      {
        url: "/_next/static/chunks/app/tools/calculators/commission/page-f68a6c12b28e3ff0.js",
        revision: "f68a6c12b28e3ff0",
      },
      {
        url: "/_next/static/chunks/app/tools/calculators/hourly-rate/page-931f0d5c92aa3ee4.js",
        revision: "931f0d5c92aa3ee4",
      },
      {
        url: "/_next/static/chunks/app/tools/calculators/industry-pricing/page-10a4158995906ce3.js",
        revision: "10a4158995906ce3",
      },
      {
        url: "/_next/static/chunks/app/tools/calculators/job-pricing/page-aba7d56d07abc111.js",
        revision: "aba7d56d07abc111",
      },
      {
        url: "/_next/static/chunks/app/tools/calculators/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/app/tools/calculators/profit-loss/page-9ddeccf5fa3d8ddd.js",
        revision: "9ddeccf5fa3d8ddd",
      },
      {
        url: "/_next/static/chunks/app/tools/layout-c13b86fc654807a9.js",
        revision: "c13b86fc654807a9",
      },
      {
        url: "/_next/static/chunks/app/tools/marketing/google-business/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/app/tools/marketing/local-services/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/app/tools/page-c3d28050977d563d.js",
        revision: "c3d28050977d563d",
      },
      {
        url: "/_next/static/chunks/d5188f0e.8178cc2e232c8679.js",
        revision: "8178cc2e232c8679",
      },
      {
        url: "/_next/static/chunks/framework-2e54dc80223aaefa.js",
        revision: "2e54dc80223aaefa",
      },
      {
        url: "/_next/static/chunks/main-035aad185799a51d.js",
        revision: "035aad185799a51d",
      },
      {
        url: "/_next/static/chunks/main-app-fcd5a3e975efff5a.js",
        revision: "fcd5a3e975efff5a",
      },
      {
        url: "/_next/static/chunks/next/dist/client/components/builtin/app-error-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/next/dist/client/components/builtin/forbidden-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/next/dist/client/components/builtin/global-error-120c5798a4111b1b.js",
        revision: "120c5798a4111b1b",
      },
      {
        url: "/_next/static/chunks/next/dist/client/components/builtin/unauthorized-ae01d968830a0113.js",
        revision: "ae01d968830a0113",
      },
      {
        url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
        revision: "846118c33b2c0e922d7b3a7676f81f6f",
      },
      {
        url: "/_next/static/chunks/webpack-374806d9563b5a43.js",
        revision: "374806d9563b5a43",
      },
      {
        url: "/_next/static/css/43ef01f7eefd56f8.css",
        revision: "43ef01f7eefd56f8",
      },
      {
        url: "/_next/static/css/de70bee13400563f.css",
        revision: "de70bee13400563f",
      },
      {
        url: "/_next/static/media/4cf2300e9c8272f7-s.p.woff2",
        revision: "18bae71b1e1b2bb25321090a3b563103",
      },
      {
        url: "/_next/static/media/747892c23ea88013-s.woff2",
        revision: "a0761690ccf4441ace5cec893b82d4ab",
      },
      {
        url: "/_next/static/media/8d697b304b401681-s.woff2",
        revision: "cc728f6c0adb04da0dfcb0fc436a8ae5",
      },
      {
        url: "/_next/static/media/93f479601ee12b01-s.p.woff2",
        revision: "da83d5f06d825c5ae65b7cca706cb312",
      },
      {
        url: "/_next/static/media/9610d9e46709d722-s.woff2",
        revision: "7b7c0ef93df188a852344fc272fc096b",
      },
      {
        url: "/_next/static/media/ba015fad6dcf6784-s.woff2",
        revision: "8ea4f719af3312a055caf09f34c89a77",
      },
      { url: "/file.svg", revision: "d09f95206c3fa0bb9bd9fefabfd0ea71" },
      { url: "/globe.svg", revision: "2aaafa6a49b6563925fe440891e32717" },
      { url: "/hero.png", revision: "d43ddf47a923fba1c8604068cab889b9" },
      {
        url: "/icon-192x192.svg",
        revision: "62ff14b57946a40aeca4691345f87cc2",
      },
      {
        url: "/icon-512x512.svg",
        revision: "e28350a00cdfedb8f11a5e2de3dcaf6c",
      },
      { url: "/manifest.json", revision: "57cf27c3e030a4e7de0bf66b41e489a1" },
      { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
      { url: "/vercel.svg", revision: "c0af2f507b369b085b35ef4bbe3bcf1e" },
      { url: "/window.svg", revision: "a2760511c65806022ad20adf74370ff3" },
    ],
    { ignoreURLParametersMatching: [] }
  );
  a.cleanupOutdatedCaches();
  a.registerRoute(
    "/",
    new a.NetworkFirst({
      cacheName: "start-url",
      plugins: [
        {
          cacheWillUpdate: async ({ response }) =>
            response && response.type === "opaqueredirect"
              ? new Response(response.body, {
                  status: 200,
                  statusText: "OK",
                  headers: response.headers,
                })
              : response,
        },
      ],
    }),
    "GET"
  );
  a.registerRoute(
    SUPABASE_REST_REGEX,
    new a.NetworkFirst({
      cacheName: "supabase-api-cache",
      networkTimeoutSeconds: 10,
      plugins: [
        new a.ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 3600 }),
      ],
    }),
    "GET"
  );
  a.registerRoute(SUPABASE_AUTH_REGEX, new a.NetworkOnly(), "GET");
  a.registerRoute(
    IMAGE_ASSET_REGEX,
    new a.CacheFirst({
      cacheName: "image-cache",
      plugins: [
        new a.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 2592e3 }),
      ],
    }),
    "GET"
  );
  a.registerRoute(
    SCRIPT_STYLE_REGEX,
    new a.StaleWhileRevalidate({
      cacheName: "static-resources",
      plugins: [
        new a.ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 86_400 }),
      ],
    }),
    "GET"
  );
});
