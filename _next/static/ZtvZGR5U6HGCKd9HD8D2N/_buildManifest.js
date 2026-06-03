self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/ELC-Las-Flores/api/:path*"
      }
    ],
    "beforeFiles": [
      {
        "source": "/ELC-Las-Flores//_next/:path+",
        "destination": "/ELC-Las-Flores/_next/:path+"
      }
    ],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()