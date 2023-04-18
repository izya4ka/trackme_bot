interface checkedTracks {
    valid: string[]
    invalid: string[]
}

const checkTracks = async (tracks: string[], regex: RegExp) => {
    const checked_tracks: checkedTracks = {
        valid: [],
        invalid: []
    }

    tracks.forEach((track) => {
        if (track.match(regex)) checked_tracks.valid.push(track)
        else checked_tracks.invalid.push(track)
    })

    return checked_tracks
    
}

export default checkTracks