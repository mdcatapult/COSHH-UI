## COSHH UI

An Angular based webapp companion to the [COSHH API](https://gitlab.mdcatapult.io/informatics/coshh/coshh-api).

### Running

You may need to `npm i` if running for the first time, and `npm install -g @angular/cli` if you don't have Angular.

### Debugging
You will need the API up and running so see the [COSHH API](https://gitlab.mdcatapult.io/informatics/coshh/coshh-api) project for info on running it.

Start the UI:
```bash
ng s
```

Go to `http://localhost:4000` in your browser.

### Angular Environment Variables

Note that Angular cannot read env vars at run time.  They are injected in via the `.environment.ts` and `environment.prod.ts`
files at build time.  *If you want to change the API URL you will need to build a new image after updating the environment file.*