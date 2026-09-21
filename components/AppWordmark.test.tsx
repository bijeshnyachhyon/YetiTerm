import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';

import { AppWordmark } from './AppWordmark';

test('AppWordmark renders decorative brand wordmark', () => {
  const markup = renderToStaticMarkup(<AppWordmark className="h-5" />);

  assert.match(markup, /YetiTerm/);
  assert.match(markup, /font-style="normal"/);
  assert.match(markup, /aria-hidden="true"/);
  assert.match(markup, /class="h-5"/);
});

test('AppWordmark exposes an accessible product name when requested', () => {
  const markup = renderToStaticMarkup(
    <AppWordmark accessibleLabel="YetiTerm" className="h-8" />,
  );

  assert.match(markup, /aria-label="YetiTerm"/);
  assert.match(markup, /role="img"/);
  assert.doesNotMatch(markup, /aria-hidden/);
});
