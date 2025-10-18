export function findPeaks(arr: number[]) {
    let peakIdx = [];
    for(let i=50; i<arr.length-1; i++) {
        if (arr[i] > arr[i-1] && arr[i] > arr[i+1] && arr[i] > 0.8)
            peakIdx.push(i);

        if(peakIdx.length == 5)
            break;
    }

    return peakIdx;
}

export function isMosquito(arr: number[]) {
    let peaks = findPeaks(arr);

    if(peaks.length < 4)
        return false;

    let isGood = true; // 봉우리들 간의 간격이 일정한지 여부
    for(let i=1; i<peaks.length-1; i++) {
        if (Math.abs((peaks[i+1] - peaks[i]) - (peaks[i] - peaks[i-1])) > 10)
            isGood = false;
    }

    if(!isGood)
        return false;

    return true;
}