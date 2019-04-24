var _ = require('lodash');

// GENERAL
// we are trying to predict where the ball will fall based on an ary of features
// where the ball starts
// the bounciness of the ball
// something else I dont remember
// so one full recording of the data looks like this :
// [320, .1, 536, 3]
// first we will only usethe first value in the ary to make our prediction
// this is called a single feature knn


// WHAT IS KNN
// KNN IS AN ALGORITHM THAT WILL LOOK AT THE K RECORDINGS/INSTANCES THAT ARE THE MOST SIMILAR TO THE ONE WE ARE TRYING To predict
// it thens look at the prediction that has the most occurence
// finally proposes to us this prediction

class Analysis {
  constructor(data){
    this.data = data
  }
  run = () => {
    const splittingPoint = 10
    const [trainingSet, testSet] = Dataset.new(this.data, splittingPoint).splitDataSet()
    // let correctPredictions = 0
    // for (let i = 0; i < testSet.length; i++){
    //   const result = KNearestNeighbour.new(trainingSet, 3, testSet[i][0]).run()
    //   console.log(`Our prediction: ${result} vs actual value : ${testSet[i][3]}`)
    //   if (result == testSet[i][3]){
    //     correctPredictions++
    //   }
    // }
    // console.log(`Our accuracy is ${correctPredictions / splittingPoint}`)

    _.range(1, 15).forEach(k => {
        const accuracy = _.chain(testSet)
                          .filter(testRow => KNearestNeighbour(trainingSet, 3, _.initial(testRow)).run === testRow[3])
                          .size()
                          .divide(splittingPoint)
                          .value
        console.log('For k of ', k, 'Accuracy is', accuracy)
      }
    )
  }
}


class KNearestNeighbour {
  constructor(data, k, predictionVector){
    this.data = data;
    this.k = k;
    this.predictionVector = predictionVector
  }
  run = () => {
    // we are first chaining data
    // once data is chained on original entry, no need to ref data anymore
    _.chain(this.data)
    // mapping have a matrix of bidimensional arrys
    // ary[-1] is the label
    // ary[0..-1] is the matrix of features
      .map(ary =>[this.distance(this.predictionVector, _.initial(ary)), _.last(ary))
    // sort data so that the closest instance to our predictionPoint are first
      .sortBy(ary => ary[0]))
    // keep only the k first
      .slice(0, k)
    // count the number of possible outcomes (transform into dict)
      .countBy(ary => ary[1])
      // transform dict in bydimensional array of vector size 2
      .toPairs()
      // sorting in asc order
      .sortBy(ary => ary[1])
      .last()
      .first()
      .parseInt()
      // make prediction based on the most common
      .value();
  }

  distance = (predictionVector, vector) => {
    let distance = 0;
    for (let i = 0; i < predictionVector.length, i++){
      distance += (predictionVector[i] - vector[i])**2
    }
    distance = distance**0.5

    return distance
  }

}


class DataSet {
  constructor(dataset, splittingPoint){
    this.dataset = dataset;
    this.splittingPoint = splittingPoint;
  }

  splitDataSet = () => {
    // we shuffle our dataset
    const shuffled = _.shuffle(this.dataset)
    // testSet is the bucket we use to test our predictions (predictionPoint in KNN)
    // we split from 0 -n
    const testSet = _.slice(shuffled, 0, this.splittingPoint)
    // trainingSet is the data we use for running KNN
    // we split from n to end
    const trainingSet = _.slice(shuffled, this.splittingPoint)
    return [trainingSet, testSet]
  }
}
