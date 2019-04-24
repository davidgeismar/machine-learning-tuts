class Normalize {
  constructor(data, featureCount){
    this.data = data;
    this.featureCount = featureCount;
  }

  // makes in place modification
  minMax = () => {
    let normalizedData = []
    for (let i=0; i < this.featureCount, i++){
      let column = []
      for (let j=0; j < this.data.length; j++){
        column.push(this.data[j][i])
      }
      let max = column.max;
      let min = column.min;
      for (let j=0; j < this.data.length; j++){
        const normalizedPoint = (this.data[j][i] - min) / (max - min)
        this.data[j][i] = normalizedPoint
      }
    }
    return this.data
  }
}
