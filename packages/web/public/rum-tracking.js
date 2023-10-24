(function (n, i, v, r, s, c, x, z) {
  x = window.AwsRumClient = { q: [], n: n, i: i, v: v, r: r, c: c };
  window[n] = function (c, p) {
    x.q.push({ c: c, p: p });
  };
  z = document.createElement('script');
  z.async = true;
  z.src = s;
  document.head.insertBefore(z, document.head.getElementsByTagName('script')[0]);
})(
  'cwr',
  '325deecf-4151-4b44-9e63-80453a84972d',
  '1.0.0',
  'eu-central-1',
  'https://client.rum.us-east-1.amazonaws.com/1.14.0/cwr.js',
  {
    sessionSampleRate: 0.1,
    guestRoleArn: 'arn:aws:iam::874817773580:role/RUM-Monitor-eu-central-1-874817773580-0515983683961-Unauth',
    identityPoolId: 'eu-central-1:cfda565b-8da7-4359-9c0d-35dbf338a721',
    endpoint: 'https://dataplane.rum.eu-central-1.amazonaws.com',
    telemetries: ['performance', 'errors', 'http'],
    allowCookies: true,
    enableXRay: false,
  }
);
