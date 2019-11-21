// canvas滤镜
const canvasFilter = {
    // 反色 rgb(255-r, 255-g, 255 - b)
    invert: function (imgData) {
        let pixes = imgData.data;
        for (let i = 0; i < pixes.length; i += 4) {
            pixes[i] = 255 - pixes[i];
            pixes[i + 1] = 255 - pixes[i + 1];
            pixes[i + 2] = 255 - pixes[i + 2];
            pixes[i + 3] = 255;
        }
    },
    // 灰色 adjust color values and make it more darker and gray
    gray: function (imgData) {
        let pixes = imgData.data;
        for (let i = 0; i < pixes.length; i += 4) {
            let r = pixes[i];
            let g = pixes[i + 1];
            let b = pixes[i + 2];
            pixes[i] = (r * 0.272) + (g * 0.534) + (b * 0.131);
            pixes[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
            pixes[i + 2] = (r * 0.393) + (g * 0.769) + (b * 0.189);
        }
    },
    // 高斯模糊
    blur: function (imgData, radius = 10) {
        let pixes = imgData.data;
        let width = imgData.width;
        let height = imgData.height;
        let gaussMatrix = [],
            gaussSum = 0,
            x, y,
            r, g, b, a,
            i, j, k, len;
        let sigma = radius / 2;
        a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
        b = -1 / (2 * sigma * sigma);
        //生成高斯矩阵
        for (i = 0, x = -radius; x <= radius; x++, i++) {
            g = a * Math.exp(b * x * x);
            gaussMatrix[i] = g;
            gaussSum += g;

        }
        //归一化, 保证高斯矩阵的值在[0,1]之间
        for (i = 0, len = gaussMatrix.length; i < len; i++) {
            gaussMatrix[i] /= gaussSum;
        }
        //x 方向一维高斯运算
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                r = g = b = a = 0;
                gaussSum = 0;
                for (j = -radius; j <= radius; j++) {
                    k = x + j;
                    if (k >= 0 && k < width) {//确保 k 没超出 x 的范围
                        //r,g,b,a 四个一组
                        i = (y * width + k) * 4;
                        r += pixes[i] * gaussMatrix[j + radius];
                        g += pixes[i + 1] * gaussMatrix[j + radius];
                        b += pixes[i + 2] * gaussMatrix[j + radius];
                        // a += pixes[i + 3] * gaussMatrix[j];
                        gaussSum += gaussMatrix[j + radius];
                    }
                }
                i = (y * width + x) * 4;
                // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
                // console.log(gaussSum)
                pixes[i] = r / gaussSum;
                pixes[i + 1] = g / gaussSum;
                pixes[i + 2] = b / gaussSum;
                // pixes[i + 3] = a ;
            }
        }
        //y 方向一维高斯运算
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                r = g = b = a = 0;
                gaussSum = 0;
                for (j = -radius; j <= radius; j++) {
                    k = y + j;
                    if (k >= 0 && k < height) {//确保 k 没超出 y 的范围
                        i = (k * width + x) * 4;
                        r += pixes[i] * gaussMatrix[j + radius];
                        g += pixes[i + 1] * gaussMatrix[j + radius];
                        b += pixes[i + 2] * gaussMatrix[j + radius];
                        // a += pixes[i + 3] * gaussMatrix[j];
                        gaussSum += gaussMatrix[j + radius];
                    }
                }
                i = (y * width + x) * 4;
                pixes[i] = r / gaussSum;
                pixes[i + 1] = g / gaussSum;
                pixes[i + 2] = b / gaussSum;
            }
        }
    },
    // 浮雕/雕刻（凸出/凹陷）
    relief: function (imgData, raised = true) {
        let data = imgData.data, length = data.length, width = imgData.width;

        for (let i = 0; i < length; i++) {
            if (i <= length - 4 * width) {
                if ((i + 1) % 4 !== 0) {
                    if ((i + 4) % (width * 4) == 0) {
                        data[i] = data[i - 4];
                        data[i + 1] = data[i - 3];
                        data[i + 2] = data[i - 2];
                        data[i + 3] = data[i - 1];
                        i += 4;
                    }
                    else {
                        // 当右边已经没有时（核心代码）
                        if (raised) data[i] = 128 + data[i] - data[i + 4];
                        else data[i] = 128 + data[i + 4] - data[i];
                    }
                }
            }
            else {
                // 当没有下一行时
                if ((i + 1) % 4 !== 0) {
                    data[i] = data[i - width * 4];
                }
            }
        }
    },
    // 镜像
    mirror: function (sourceData, newData, horizontal = true) {
        if (horizontal) {
            for (let i = 0, h = sourceData.height; i < h; i++) {
                for (j = 0, w = sourceData.width; j < w; j++) {
                    newData.data[i * w * 4 + j * 4 + 0] = sourceData.data[i * w * 4 + (w - j - 1) * 4 + 0];
                    newData.data[i * w * 4 + j * 4 + 1] = sourceData.data[i * w * 4 + (w - j - 1) * 4 + 1];
                    newData.data[i * w * 4 + j * 4 + 2] = sourceData.data[i * w * 4 + (w - j - 1) * 4 + 2];
                    newData.data[i * w * 4 + j * 4 + 3] = sourceData.data[i * w * 4 + (w - j - 1) * 4 + 3];
                }
            }
        }
        else {
            for (let i = 0, h = sourceData.height; i < h; i++) {
                for (j = 0, w = sourceData.width; j < w; j++) {
                    newData.data[i * w * 4 + j * 4 + 0] = sourceData.data[(h - i) * w * 4 + j * 4 + 0];
                    newData.data[i * w * 4 + j * 4 + 1] = sourceData.data[(h - i) * w * 4 + j * 4 + 1];
                    newData.data[i * w * 4 + j * 4 + 2] = sourceData.data[(h - i) * w * 4 + j * 4 + 2];
                    newData.data[i * w * 4 + j * 4 + 3] = sourceData.data[(h - i) * w * 4 + j * 4 + 3];
                }
            }
        }
    }
}