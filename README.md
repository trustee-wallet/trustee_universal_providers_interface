# Trustee Universal Interface

## Introduction

Each method must be implemented as a separate API endpoint.

Methods **estimate amount**, **create order**, **check order** and **cancel order** must be authenticated.

## Exchange ways file

You must implement an endpoint that will return a list of exchange ways.

Requirements for the exchange ways file are the same as for exchanger monitors.

Here is an [example of documentation](https://www.bestchange.com/wiki/rates.html) on how to properly create a exchange ways file.

```xml
<rates>
    <item>
        <from>XMR</from>
        <to>QWRUB</to>
        <in>1.00000000</in>
        <out>21284.32320000</out>
        <amount>851556.18</amount>
        <fromfee>0.000000 XMR</fromfee>
        <tofee>0.00 RUB</tofee>
        <minamount>0.039796 XMR</minamount>
        <maxamount>3.757901 XMR</maxamount>
    </item>
    <item>
        <from>LTC</from>
        <to>CARDRUB</to>
        <in>1.00000000</in>
        <out>13596.07014551</out>
        <amount>851556.18</amount>
        <fromfee>0.000000 LTC</fromfee>
        <tofee>0.00 RUB</tofee>
        <minamount>0.552109 LTC</minamount>
        <maxamount>3.330972 LTC</maxamount>
    </item>
</rates>
```

## Authentication

Authentication parameters are passed to **headers**:

| Header | Type | Required |  Description |
| ------ | ------ | ------ | ------ |
| **trustee-public-key** | String  | optional | Partner's public key. |
| **trustee-timestamp**  | String | required | Timestamp that was used to generate the signature. |
| **trustee-signature** | String | required | Signature. |

An [example](https://github.com/trustee-wallet/trustee_universal_providers_interface/blob/master/signature.js) of generating a signature.

You can check the signature using this endpoint (*first you need to share a API keys with the Trustee team*):

`
https://testapiv3.trustee.deals/trustee-universal/check-signature
`

### Request body:

body that will be used to generate signature.

### Request headers:

| Header | Type | Required |  Description |
| ------ | ------ | ------ | ------ |
| **trustee-public-key** | String  | required | Partner's public key. |
| **trustee-timestamp**  | String | required | Timestamp which will be used to generate signature. |

### Response body:

| Parameter | Type |  Description |
| ------ | ------ | ------ |
| **parametersSequence** | String  | Sequence of parameters for **initString**. |
| **initString**  | String | A string that will be used to generate a signature. |
| **signature**  | String | Signature for request body. |

### Response headers:

| Header | Type | Required |  Description |
| ------ | ------ | ------ | ------ |
| **trustee-timestamp** | String  | required | Timestamp which was used to generate a response signature. |
| **trustee-signature**  | String | required | Signature for response body. |

With the help of **Response headers**, you can check the generation of response signature. It is identical to the request signature process.

## POST: Estimate amount

### Request body:

| Parameter | Type | Required |  Description |
| ------ | ------ | ------ | ------ |
| **from** | String  | required | Code for **from** currency. Same as in the exchange ways file. |
| **to**  | String | required | Code for **to** currency. Same as in the exchange ways file. |
| **fromAmount** or **toAmount** | Number  | required | The amount for which you need to calculate. Transmitted in the **from** currency or **to** currency. |
| **extraFromFee**\*  | Number | required if the exchanger supports\*\* | Trustee fee which will be taken from the **from** currency. |
| **extraToFee**\*  | Number | required if the exchanger supports\*\* | Trustee fee which will be taken from the **to** currency. |

\* – If Trustee fee is 0.5% then 0.005 must be transmitted.

\*\* – If the exchanger does not support the dynamic setting of fees (**extraFromFee** and **extraToFee** parameters), then it can set it statically on its side. In this case, different Trustee fees will be set for different pairs of API keys.

### Response body:

| Parameter | Type | Required |  Description | Example
| ------ | ------ | ------ | ------ | ------ |
| **from** | String  | required | Code for **from** currency. Same as in the exchange ways file. | CARDRUB |
| **to**  | String | required | Code for **to** currency. Same as in the exchange ways file. | BTC |
| **fromAmount** | Number  | required | The amount that the client must pay. | 6500 |
| **toAmount** | Number  | required | The amount that the client will receive. | 0.0016 |
| **fromRate**\* | Number  | required | Rate that is represented in the **from** currency. | 3079761.9 |
| **toRate**\* | Number  | required | Rate that is represented in the **to** currency. | 1 |
| **fromFee**  | Number | required | Exchanger fee which will be taken from the **from** currency. | 0 |
| **toFee**  | Number | required | Exchanger fee which will be taken from the **to** currency. | 0.0005 |
| **extraFromFee**  | Number | required | Trustee fee which will be taken from the **from** currency. | 32.5 |
| **extraToFee**  | Number | required | Trustee fee which will be taken from the **to** currency. | 0 |

\* – One of the parameters (**fromRate** or **toRate**) must be "1", and the other show the rate.

#### Example:

Trustee fee is 0.5%.

0.5% from 6500 = 32.5 RUB (**extraFromFee**)

6500 RUB – 32.5 RUB = 6467.5 RUB * 3079761.9 (**fromRate**) = 0.0021 BTC

0.0021 BTC – 0.0005 BTC (**toFee**) = 0.0016 BTC (**toAmount**).

#### In case of error:

| Parameter | Type | Required |  Description |
| ------ | ------ | ------ | ------ |
| **errorCode** | String  | required | Code for error. |
| **message**  | String | required | Error description. |
| **minAmount** or **maxAmount** | Number  | required\* | The limit on which the user has not passed. You need to transmit only one parameter. |

\* – **minAmount** or **maxAmount** must be transmitted only when the **errorCode** is equal to "EXCEEDING_LIMITS".

#### Error codes list:

| Parameter |  Description |
| ------ | ------ |
| **EXCEEDING_LIMITS** | The user has not passed on acceptable limits. |
| **PROVIDER_ERROR**  | Any other error. |

## POST: Create order

### Request body:

| Parameter | Type | Required |  Description |
| ------ | ------ | ------ | ------ |
| **from** | String  | required | Сode for **from** currency. Same as in the exchange ways file. |
| **to**  | String | required | Сode for **to** currency. Same as in the exchange ways file. |
| **fromAmount** | Number  | required | The amount that the client must pay. |
| **toAmount** | Number  | required | The amount that the client will receive. |
| **userId** | String  | optional | Anonymous user ID. |
| **redirectUrl** | String  | required | The amount that the client will receive. |
| **toPaymentDetails** | String  | required | Payment details of where the user will receive funds. |
| **fromPaymentDetails** | String  | optional | Payment details from which will take funds. |
| **toMemo** | String  | optional | If additional data must be attached to the **toPaymentDetails**, for example for XRP currency. |
| **extraFromFee**\*  | Number | required if the exchanger supports\*\* | Trustee fee which will be taken from the **from** currency. |
| **extraToFee**\*  | Number | required if the exchanger supports\*\* | Trustee fee which will be taken from the **to** currency. |

\* – If Trustee fee is 0.5% then 0.005 must be transmitted.

\*\* – If the exchanger does not support the dynamic setting of fees (**extraFromFee** and **extraToFee** parameters), then it can set it statically on its side. In this case, different Trustee fees will be set for different pairs of API keys.

### Response body:

| Parameter | Type | Required |  Description |
| ------ | ------ | ------ | ------ |
| **id** | String | required | Order ID. |
| **payUrl** | String | required\* | Link to pay fiat. It needs to be opened to the client. |
| **cryptoAddress** | String | required\* | Cryptocurrency address where the client needs to send money. |
| **cryptoMemo** | String | optional | Additional information to the **cryptoAddress** (need for example for XRP currency). |
| **from** | String  | required | Сode for **from** currency. Same as in the exchange ways file. |
| **to**  | String | required | Сode for **to** currency. Same as in the exchange ways file. |
| **fromAmount** | Number  | required | The amount that the client must pay. |
| **toAmount** | Number  | required | The amount that the client will receive. |
| **userId** | String  | optional | Anonymous user ID. |
| **redirectUrl** | String  | required | The amount that the client will receive. |
| **toPaymentDetails** | String  | required | Payment details of where the user will receive funds. |
| **fromPaymentDetails** | String  | optional | Payment details from which will take funds. |
| **toMemo** | String  | optional | If additional data must be attached to the **toPaymentDetails**, for example for XRP currency. |
| **extraFromFee**  | Number | required | Trustee fee which will be taken from the **from** currency. |
| **extraToFee**  | Number | required | Trustee fee which will be taken from the **to** currency. |

\* – Only one of the parameter must be returned in the response. It depends on whether the client needs to make a fiat deposit or crypto deposit.

All parameters that were used when creating should return to the response.

#### In case of error:

| Parameter | Type | Required |  Description |
| ------ | ------ | ------ | ------ |
| **message**  | String | required | Error description. |

## GET: Check order

### Request body (Query string):

| Parameter | Type | Required |  Description |
| ------ | ------ | ------ | ------ |
| **id** | String  | required | Order ID. |

### Response body:

| Parameter | Type | Required |  Description |
| ------ | ------ | ------ | ------ |
| **id** | String | required | Order ID. |
| **status** | String | required | Order status |
| **payUrl** | String | required\* | Link to pay fiat. It needs to be opened to the client. |
| **cryptoAddress** | String | required\* | Cryptocurrency address where the client needs to send money. |
| **cryptoMemo** | String | optional | Additional information to the **cryptoAddress** (need for example for XRP currency). |
| **from** | String  | required | Сode for **from** currency. Same as in the exchange ways file. |
| **to**  | String | required | Сode for **to** currency. Same as in the exchange ways file. |
| **fromAmount** | Number  | required | The amount that the client must pay. |
| **toAmount** | Number  | required | The amount that the client will receive. |
| **userId** | String  | optional | Anonymous user ID. |
| **redirectUrl** | String  | required | The amount that the client will receive. |
| **toPaymentDetails** | String  | required | Payment details of where the user will receive funds. |
| **fromPaymentDetails** | String  | optional | Payment details from which will take funds. |
| **toMemo** | String  | optional | If additional data must be attached to the **toPaymentDetails**, for example for XRP currency. |
| **fromTxHash** | String  | required | Hash transaction of client deposit. |
| **toTxHash** | String  | required | Hash transaction of payment to the client. |
| **extraFromFee**  | Number | required | Trustee fee which will be taken from the **from** currency. |
| **extraToFee**  | Number | required | Trustee fee which will be taken from the **to** currency. |

\* – Only one of the parameter must be returned in the response. It depends on whether the client needs to make a fiat deposit or crypto deposit.

### Order statuses

| Status |  Description |
| ------ | ------ |
| **WAITING** | Waiting for client deposit. |
| **RECEIVED**  | Received client deposit. |
| **EXCHANGING** | Exchange is carried out. |
| **SENDING**  | In the process of payment to the client. |
| **COMPLETED** | Order successfully completed. |
| **NOT_ENTIRE_WITHDRAW**  | Not the whole amount is paid (occurs during fiat conclusions). In this case, the amount that the client has already received should be specified in **toAmount**. |
| **REFUNDED** | The money was returned to the client. |
| **EXPIRED**  | The order was not paid for the time allocated (some exchangers know how to automatically restore such orders by recalculating the course through another endpoint). |
| **CANCELED** | The order was canceled. |
| **FAILED**  | In the process of execution of the order, an error occurred. |
| **HOLDED** | The warrant is suspended to check KYC. |

#### In case of error:
| Parameter | Type | Required |  Description |
| ------ | ------ | ------ | ------ |
| **message**  | String | required | Error description. |

## POST: Cancel order

### Request body:

| Parameter | Type | Required |  Description |
| ------ | ------ | ------ | ------ |
| **id** | String  | required | Order ID. |

### Response body:
| Parameter | Type | Required |  Description | Example
| ------ | ------ | ------ | ------ | ------ |
| **status** | String  | required | Status of the canceling. | SUCCESS |

#### In case of error:
| Parameter | Type | Required |  Description |
| ------ | ------ | ------ | ------ |
| **message**  | String | required | Error description. |
