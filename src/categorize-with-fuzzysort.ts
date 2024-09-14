import * as fuzzysort from 'fuzzysort'

import discs from '../discs-db.json'
import sampleInput from '../sample-input.json'


sampleInput.data.text.words.forEach(word => {
    const results = fuzzysort.go(
        word.word,
        discs.data,
        {
            threshold: 0.2,
            keys: ['attributes.MoldName', 'attributes.BrandName']
        }
    )

    results.forEach(keysResult => {
            console.log('Word', word.word)
            console.log('Score', keysResult.score)
            console.log('Object', keysResult.obj.attributes)
    })

    console.log('\n')
})
