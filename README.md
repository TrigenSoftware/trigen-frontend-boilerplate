
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
├── images:build
├── images:dev
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
├─┬ watch
│ ├── html:watch
│ ├── images:watch
│ ├── style:watch
│ └── script:watch
├── server
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
