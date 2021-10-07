# Change Log

## 2021-10-07

### Added

- Added **fromRevenueShare** and **toRevenueShare** required parameters for response body of "Estimate amount" endpoint.
- Added **fromRevenueShare** and **toRevenueShare** required parameters for response body of "Create order" endpoint.
- Added **fromRevenueShare** and **toRevenueShare** required parameters for response body of "Check order" endpoint.
- Added **fromRevenueShare** and **toRevenueShare** required parameters for response body of "Restore EXPIRED order" endpoint.

## 2021-08-23

### Added

- Added **fromRate** and **toRate** optional parameters for error body of "Estimate amount" endpoint.

## 2021-08-18

### Added

- Added support for fixed rate exchange ways:

#### Exchange ways list endpoint:

- Added **ratetype** optional parameter.

#### Estimate amount endpoint:

- Added **rateType** optional parameter for request body.
- Added **rateType** optional parameter for response body. Added **rateId** and **rateIdExpirationTimestamp** required parameters for response body if **rateType** is equals to **FIXED**.

#### Create order endpoint:

- Added **rateType** (optional) parameter and **rateId** (required if **rateType** is **FIXED**) parameter for request body.
- Added **rateType** optional parameter for response body.
- Added **errorCode** parameter in case of error. Added support of **EXPIRED_RATE errorCode**.

#### Check order endpoint:

- Added **rateType** optional parameter for response body.

#### Restore EXPIRED order endpoint:

- Added **rateType** optional parameter for response body.

## 2021-08-09

### Added

- Added new optional endpoint for restoring EXPIRED orders. [Doc](https://github.com/trustee-wallet/trustee_universal_providers_interface#post-restore-expired-order).

## 2021-07-28

### Added

- Added new optional parameter for order object – **fromAmountReceived** – amount without a bank fee if it is.

## 2021-07-26

### Added

- Added new optional header for requests – **trustee-env** – which shows from which the environment sent a request. It can be *LOCAL, DEV or PROD*.

## 2021-07-13

### Added

- Support for a fixed and percentage fee together for [Exchange ways list endpoint](https://github.com/trustee-wallet/trustee_universal_providers_interface#get-exchange-ways-list).