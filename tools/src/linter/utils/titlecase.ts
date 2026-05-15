/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

// Based on "To Title Case" by David Gouch (MIT) with modifications by @rvagg.

const SMALL_WORDS = [
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'en', 'for', 'if', 'in',
  'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'vs\\.?', 'via',
  'some', 'because', 'yet', 'so',
  'abaft', 'aboard', 'about', 'above', 'absent', 'across', 'afore', 'after',
  'against', 'along', 'alongside', 'amid', 'amidst', 'among', 'amongst',
  'apropos', 'apud', 'around', 'aside', 'astride', 'athwart', 'atop',
  'barring', 'before', 'behind', 'below', 'beneath', 'beside', 'besides',
  'between', 'beyond', 'circa', 'concerning', 'despite', 'down', 'during',
  'except', 'excluding', 'failing', 'following', 'forenenst', 'from', 'given',
  'including', 'inside', 'into', 'like', 'mid', 'midst', 'minus', 'modulo',
  'near', 'next', 'notwithstanding', "o'", 'off', 'onto', 'opposite', 'out',
  'outside', 'over', 'pace', 'past', 'plus', 'pro', 'qua', 'regarding',
  'round', 'sans', 'save', 'since', 'than', 'through', 'throughout', 'thru',
  'thruout', 'till', 'times', 'toward', 'towards', 'under', 'underneath',
  'unlike', 'until', 'unto', 'up', 'upon', 'versus', 'vice', 'vis-à-vis',
  'with', 'within', 'without', 'worth', 'is'
]

const SMALL_WORDS_RE = new RegExp('^(' + SMALL_WORDS.join('|') + ')$', 'i')

export function toLaxTitleCase (str: string): string {
  if (!str) return str
  return str.replace(/[A-Za-z0-9À-ÿ]+[^\s-]*/g, (match, index: number, title: string) => {
    if (index > 0 && index + match.length !== title.length &&
      match.search(SMALL_WORDS_RE) > -1 && title.charAt(index - 2) !== ':' &&
      (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
      title.charAt(index - 1).search(/[^\s-]/) < 0) {
      return match.toLowerCase()
    }

    if (match.substr(1).search(/[A-Z]|\../) > -1) {
      return match
    }

    return match.charAt(0).toUpperCase() + match.substr(1)
  })
}
