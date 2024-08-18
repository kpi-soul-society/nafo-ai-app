<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

</div>

<p align="center">
  <a href="https://nafoai.com" rel="noopener">
 <img width=200px height=200px src="./readme/logo.png"></a>

 <h3 align="center"><a href="https://nafoai.com">NAFO AI</a></h3>
  <p align="center">
    Create your NAFO-themed images with AI and support Ukraine!
  </p>
</p>

# ARCHIVED :warning:

# About the project

[nafoai.com](https://nafoai.com) is a non-profit project that aims to fundraise for 🇺🇦 Ukraine and hopefully entertain you in the process. For a custom donation (which will go directly to the [United24](https://u24.gov.ua) charity) you get a proportional number of tokens to spend in the AI editor on the [NAFO](https://nafo-ofan.org)-themed image generation.

It's important to note that this project is by no means aimed as a replacement for the terrific job the NAFO [forgers](https://nafo-ofan.org/pages/forger-spotlight) are doing when hand-crafting the avatars. Our intention is to offer a quick and fun way to experiment with the avatars on your own.

## What is NAFO?

NAFO is a movement fundraising for Ukraine's defenders and battling Russian disinformation online. Their profits benefit verified Ukrainian charities. You can learn more about NAFO on [their official website](https://nafo-ofan.org).

## How is this project related to NAFO?

Authors of this project are not directly affiliated with NAFO, but we are a proud supporter of their cause. [nafoai.com](https://nafoai.com) was built by fellas from Ukraine seeking to harness the latest breakthroughs in AI to help their country.

# Building blocks

In summary the web app is built with AWS CDK, Lambda and MySQL. It has [SST](https://sst.dev) at the heart of it - the OG full-stack framework for building serverless apps on top of AWS.

Big shout out to [Mischa Spiegelmock](https://github.com/revmischa) for trailblazing the path with [sst-prisma](https://github.com/jetbridge/sst-prisma). Our team learned about [SST](https://sst.dev) thanks to that template and borrowed a great deal from it.

You can discover more about each tool using the links below.

- 🌩 [SST](https://sst.dev) - powerful CDK developer experience tools
- 🌤 [AWS CDK](https://aws.amazon.com/cdk/) - cloud-native infrastructure as code
- 🌐 [REST API Gateway](https://docs.sst.dev/apis)
- ፨ [GraphQL API](https://docs.sst.dev/apis#graphql)
  - ✽ [Code-first schema](https://docs.sst.dev/apis#pothos) with [Typesafe query builder](https://genql.dev) + [React client](https://formidable.com/open-source/urql/docs/)
- 🖥 [NextJS](https://nextjs.org/) frontend w/ Tailwind CSS and Headless UI
  - 🎨 [Tailwind CSS](https://tailwindcss.com) - styling solution for iterating blazingly fast
  - 🧩 [Headless UI](https://headlessui.com) - unstyled and lightweight UI components, easily integrated with Tailwind
  - 🔓 [NextAuth.js](https://next-auth.js.org/) - authentication and session management on the frontend
- 🔓 [SST Auth](https://docs.sst.dev/auth) - authentication backend that makes rolling your own auth easy and flexible
- 💾 [Kysely](https://kysely.dev) - SQL query builder
- 🔋 [Planetscale](https://planetscale.com) - MySQL
- 💰 [Fondy](https://fondy.ua/uk/) - payment provider. Allowed us to have all the donations go straight to the charity's bank account. Their support team has been very helpful.
- ✅ [Toggled.dev](https://www.toggled.dev) - feature flags
- ⚡️ [Live local lambda development](https://docs.sst.dev/live-lambda-development) (`pnpm dev`)
  - 🐞 [Lambda debugging](https://docs.sst.dev/live-lambda-development#debugging-with-vs-code) - set breakpoints on your lambda functions and step through in your IDE
- 📦 [pnpm](https://pnpm.io/) - fast and efficient package manager
- 🐛 [ES Modules](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)
- 🔧 [ESBuild](https://esbuild.github.io/) - fast code bundling on backend (under the hood) with tree-shaking
- 🫙 [Middy](https://middy.js.org/) - middleware for Lambda functions
- 🛠 [AWS Lambda Powertools](https://awslabs.github.io/aws-lambda-powertools-typescript/latest/) - for [custom metrics](https://awslabs.github.io/aws-lambda-powertools-typescript/latest/core/metrics/), [structured logging](https://awslabs.github.io/aws-lambda-powertools-typescript/latest/core/logger/), and [tracing](https://awslabs.github.io/aws-lambda-powertools-typescript/latest/core/tracer/).

## Pre-commit hooks

We use [Husky](https://typicode.github.io/husky/#/) and [lint-staged](https://www.npmjs.com/package/lint-staged) to run tsc, eslint, and prettier on commit

## Monitoring

[SST Console](https://docs.sst.dev/console) provides a useful web dashboard for viewing logs and issues.

## CI/CD

[SEED](https://seed.run), developed by the team behind SST, is used for deployments. It also provides alerting via email and Slack. It's likely to get replaced by the SST Console in the foreseeable future.

# Scripts

## Prerequisites

Assumes you have at least [Node 18](https://nodejs.org/en/download/current/) installed and AWS credentials [configured](https://docs.sst.dev/advanced/iam-credentials).
You should also take the env vars from `.env.example` and make sure you set them inside `.env` in the root of the project.

## Setup

```shell
npm i -g pnpm  # install pnpm globally
pnpm i  # install dependencies
pnpm dev  # start local dev server
```

### Start Nextjs frontend dev server

```shell
pnpm dev:web
```

### Create a new migration

```shell
pnpm gen migration new
```

### Generate types from the DB schema

```shell
pnpm gen:db:types
```

### Deploy to your AWS environment

```shell
pnpm deploy
```

### Deploy to specific AWS environment (region/profile)

```shell
pnpm deploy --region eu-central-1 --profile prod
```

### Remove your AWS resources

```shell
pnpm remove
```
