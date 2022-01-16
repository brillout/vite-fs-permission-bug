export { serializeTelefunctionResult }

import { stringify } from '@brillout/json-s'
import { assertUsage } from '../utils'

function serializeTelefunctionResult(runContext: {
  telefunctionReturn: unknown
  telefunctionName: string
  telefunctionAborted: boolean
}) {
  const bodyValue: Record<string, unknown> = {
    ret: runContext.telefunctionReturn,
  }
  if (runContext.telefunctionAborted) {
    bodyValue.aborted = true
  }
  try {
    const httpResponseBody = stringify(bodyValue)
    return httpResponseBody
  } catch (err: unknown) {
    assertUsage(
      false,
      [
        `Couldn't serialize value returned by telefunction \`${runContext.telefunctionName}\`.`,
        'Make sure returned values',
        'to be of the following types:',
        '`Object`, `string`, `number`, `Date`, `null`, `undefined`, `Inifinity`, `NaN`, `RegExp`.',
      ].join(' '),
    )
  }
}
