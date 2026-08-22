import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RocketMath from '../RocketMath.vue'

describe('RocketMath', () => {
  it('limits the answer input to numeric characters', async () => {
    const wrapper = mount(RocketMath)
    const answerInput = wrapper.get('#answer_input')

    expect(answerInput.attributes('inputmode')).toBe('numeric')
    expect(answerInput.attributes('pattern')).toBe('[0-9]*')

    await answerInput.setValue('12a-3.4')

    expect((answerInput.element as HTMLInputElement).value).toBe('1234')
  })
})
