# Airbnb Filters

Chrome extension with advanced Airbnb filters

## Usage

There is no deployed extension yet, but you can use latest build from [actions](https://github.com/vlad-iakovlev/airbnb-filters/actions/workflows/ci.yml):

1. Go to [actions](https://github.com/vlad-iakovlev/airbnb-filters/actions/workflows/ci.yml) page.
2. Click the latest workflow run.
3. Download the artifact `airbnb-filters-build`.
4. Extract the archive.
5. Open [Chrome Extensions Page](chrome://extensions/).
6. Enable Developer mode.
7. Click "Load unpacked" and select the extracted folder.

## Deployment

1. Install dependencies

   ```sh
   npm ci
   ```

2. Build

   ```sh
   npm run build
   ```

3. Deploy `/dist`

## Development

1. Install dependencies

   ```sh
   npm ci
   ```

2. Build in watch mode

   ```sh
   npm run dev
   ```

3. Load unpacked extension from `/dist`
