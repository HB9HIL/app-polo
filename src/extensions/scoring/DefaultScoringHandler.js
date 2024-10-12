/*
 * Copyright ©️ 2024 Sebastian Delmont <sd@ham2k.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export const DefaultScoringHandler = {
  key: 'defaultOperation',
  scoringForQSO: ({ qso, qsos, operation, ref }) => {
    const { band, mode, key, startOnMillis } = qso

    const nearDupes = (qsos || []).filter(q => !q.deleted && (startOnMillis ? q.startOnMillis < startOnMillis : true) && q.their.call === qso.their.call && q.key !== key)

    if (nearDupes.length === 0) {
      return { count: 1, type: 'defaultOperation' }
    } else {
      const sameBand = nearDupes.filter(q => q.band === band).length !== 0
      const sameMode = nearDupes.filter(q => q.mode === mode).length !== 0
      if (sameBand && sameMode) {
        return { count: 0, alerts: ['duplicate'], type: 'defaultOperation' }
      } else {
        const notices = []
        if (!sameMode) notices.push('newMode')
        if (!sameBand) notices.push('newBand')

        return { count: 1, notices, type: 'defaultOperation' }
      }
    }
  }
}