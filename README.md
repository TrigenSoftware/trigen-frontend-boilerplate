
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
├── script:watch
├── script:lint
├─┬ script:dev
│ └── script:lint
├─┬ script:build
│ └── script:lint
├── server
├─┬ watch
│ ├── html:watch
│ ├── images:watch
│ ├── style:watch
│ └── script:watch
├─┬ dev
│ └─┬── html:dev
│   ├── images:dev
│   ├── style:dev
│   ├── script:dev
│   ├── server
│   └── watch
├─┬ build
│ └─┬── html:build
│   ├── images:build
│   ├── style:build
│   └── script:build
└─┬ default
  └── dev
```
