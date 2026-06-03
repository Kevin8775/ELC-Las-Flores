self.__MIDDLEWARE_MATCHERS = [
  {
    "regexp": "^\\/ELC-Las-Flores(?:\\/(_next\\/data\\/[^/]{1,}))?\\/dashboard(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$",
    "originalSource": "/dashboard/:path*"
  },
  {
    "regexp": "^\\/ELC-Las-Flores(?:\\/(_next\\/data\\/[^/]{1,}))?\\/estudiantes(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$",
    "originalSource": "/estudiantes/:path*"
  },
  {
    "regexp": "^\\/ELC-Las-Flores(?:\\/(_next\\/data\\/[^/]{1,}))?\\/docentes(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$",
    "originalSource": "/docentes/:path*"
  },
  {
    "regexp": "^\\/ELC-Las-Flores(?:\\/(_next\\/data\\/[^/]{1,}))?\\/grupos(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$",
    "originalSource": "/grupos/:path*"
  },
  {
    "regexp": "^\\/ELC-Las-Flores(?:\\/(_next\\/data\\/[^/]{1,}))?\\/pagos(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$",
    "originalSource": "/pagos/:path*"
  },
  {
    "regexp": "^\\/ELC-Las-Flores(?:\\/(_next\\/data\\/[^/]{1,}))?\\/reportes(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$",
    "originalSource": "/reportes/:path*"
  }
];self.__MIDDLEWARE_MATCHERS_CB && self.__MIDDLEWARE_MATCHERS_CB()