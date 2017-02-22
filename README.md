
# trigen-frontend-boilerplate

Boilerplate for frontend development.

# Gulp tasks

```
├── html:watch
├── html:lint
├─┬ html:dev
│ └── html:lint
├─┬ html:build
│ └── html:lint
├── images:watch
├── images:dev
├── images:build
├── style:watch
├── style:lint
├─┬ style:dev
│ └── style:lint
├─┬ style:build
│ └── style:lint
├── script:lint
├─┬ webpack:dev
│ └── script:lint
├─┬ webpack:build
│ └── script:lint
├── server
├─┬ watch
│ ├── html:watch
│ ├── images:watch
│ └── style:watch
├─┬ dev
│ └─┬── html:dev
│   ├── images:dev
│   ├── style:dev
│   ├── webpack:dev
│   └── watch
├─┬ build
│ └─┬── html:build
│   ├── images:build
│   ├── style:build
│   └── webpack:build
└─┬ default
  └── dev
```
