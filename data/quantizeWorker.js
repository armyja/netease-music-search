

function quantize(data, k) {
    // 将颜色值转换为三维向量
    const vectors = [];
    for (let i = 0; i < data.length; i += 4) {
        vectors.push([data[i], data[i + 1], data[i + 2]]);
    }

    // 随机选择 K 个聚类中心
    const centers = [];
    for (let i = 0; i < k; i++) {
        centers.push(vectors[Math.floor(Math.random() * vectors.length)]);
    }

    // 迭代更新聚类中心
    let iterations = 0;
    while (iterations < 100) {
        // 分配数据点到最近的聚类中心所在的簇中
        const clusters = new Array(k).fill().map(() => []);
        for (let i = 0; i < vectors.length; i++) {
            let minDist = Infinity;
            let minIndex = 0;
            for (let j = 0; j < centers.length; j++) {
                const dist = distance(vectors[i], centers[j]);
                if (dist < minDist) {
                    minDist = dist;
                    minIndex = j;
                }
            }
            clusters[minIndex].push(vectors[i]);
        }

        // 更新聚类中心
        let converged = true;
        for (let i = 0; i < centers.length; i++) {
            const cluster = clusters[i];
            if (cluster.length > 0) {
                const newCenter = cluster
                    .reduce((acc, cur) => [
                        acc[0] + cur[0],
                        acc[1] + cur[1],
                        acc[2] + cur[2],
                    ])
                    .map((val) => val / cluster.length);
                if (!equal(centers[i], newCenter)) {
                    centers[i] = newCenter;
                    converged = false;
                }
            }
        }

        if (converged) {
            break;
        }

        iterations++;
    }

    // 将每个像素点的颜色值替换为所在簇的聚类中心的颜色值
    for (let i = 0; i < data.length; i += 4) {
        const vector = [data[i], data[i + 1], data[i + 2]];
        let minDist = Infinity;
        let minIndex = 0;
        for (let j = 0; j < centers.length; j++) {
            const dist = distance(vector, centers[j]);
            if (dist < minDist) {
                minDist = dist;
                minIndex = j;
            }
        }
        const center = centers[minIndex];
        data[i] = center[0];
        data[i + 1] = center[1];
        data[i + 2] = center[2];
    }

    // 计算每个颜色值在图像中出现的次数，并按出现次数从大到小排序
    const counts = {};
    for (let i = 0; i < data.length; i += 4) {
        const color = `rgb(${data[i]}, ${data[i + 1]}, ${data[i + 2]})`;
        counts[color] = counts[color] ? counts[color] + 1 : 1;
    }
    const sortedColors = Object.keys(counts).sort(
        (a, b) => counts[b] - counts[a]
    );

    // 取前 k 个颜色作为主要颜色
    return sortedColors.slice(0, k);
}

function distance(a, b) {
    return Math.sqrt(
        (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
    );
}

function equal(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
onmessage = function(e) {
    const { id,data, k } = e.data; // 从主线程接收数据
    const result = quantize(data, k); // 调用 quantize 函数
    postMessage({id:id,ret:result}); // 将结果发送回主线程
};