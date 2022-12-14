import { testGenerateShield, replaceShieldTypeAlias } from './generateShield'
import { expect, describe, it } from 'vitest'

describe('generateShield', () => {
  it('generateShield, one telefunction', async () => {
    const src = `export function doSomething(arg: string) {

}`
    const shieldedSrc = testGenerateShield(src)
    expect(shieldedSrc).toEqual(`import { shield as __telefunc_shield } from "telefunc";

${src}

const __telefunc_t = __telefunc_shield.type;
__telefunc_shield(doSomething, [__telefunc_t.string], { __autoGenerated: true })
`)
  })

  it('generateShield, two telefunctions', async () => {
    const src = `export function doSomething(arg: string) {

}

export function doSomethingElse(arg: string | number, arg2: { val?: number }) {

}`
    const shieldedSrc = testGenerateShield(src)
    expect(shieldedSrc).toEqual(`import { shield as __telefunc_shield } from "telefunc";

${src}

const __telefunc_t = __telefunc_shield.type;
__telefunc_shield(doSomething, [__telefunc_t.string], { __autoGenerated: true })
__telefunc_shield(doSomethingElse, [__telefunc_t.or(__telefunc_t.number, __telefunc_t.string), { val: __telefunc_t.optional(__telefunc_t.number) }], { __autoGenerated: true })
`)
  })

  it('replaceShieldTypeAlias', () => {
    expect(replaceShieldTypeAlias("t.const('')")).toEqual("__telefunc_t.const('')")
    expect(replaceShieldTypeAlias("t.const('test')")).toEqual("__telefunc_t.const('test')")
    expect(replaceShieldTypeAlias("t.const('t.')")).toEqual("__telefunc_t.const('t.')")
    expect(replaceShieldTypeAlias("t.const('some-t.string')")).toEqual("__telefunc_t.const('some-t.string')")
    expect(replaceShieldTypeAlias("t.const('t.const't.')")).toEqual("__telefunc_t.const('t.const't.')")

    expect(replaceShieldTypeAlias("t.array(t.const('t.'))")).toEqual("__telefunc_t.array(__telefunc_t.const('t.'))")
  })
})
