const crypto = require('crypto');

/**
 * These are test keys
 */
const PUBLIC_KEY = 'lQDPDlxi5sb1ABKXOAjLIF2L9ISTjKqSIvrVylKX';
const PRIVATE_KEY = 'UvdvS3KF7zTFKdbGzDoIDgz7P4XDSQSBWv25crzu';

const body = {
    from: 'CARDRUB',
    to: 'BTC',
    fromAmount: 6500
};

const now = +new Date();
const keys = Object.keys(body).sort();
let initString = '';
let parametersSequence = ''; // needed only for check the initString generation sequence.

for (let i = 0; i < keys.length; i++) {
    if (!body[keys[i]] || typeof body[keys[i]] === 'object') {
        continue;
    }
    initString += keys[i].toLowerCase() + body[keys[i]].toString().toLowerCase();
    parametersSequence += keys[i] + ' | ';
}

initString += 'timestamp' + now;
parametersSequence += 'timestamp';

const signature = crypto.createHmac('SHA512', PRIVATE_KEY).update(initString).digest('hex');

console.log('parametersSequence: ' + parametersSequence);
console.log('initString: ' + initString + '\n');
console.log('Headers:');
console.log('trustee-public-key: ' + PUBLIC_KEY);
console.log('trustee-timestamp: ' + now);
console.log('trustee-signature: ' + signature);
