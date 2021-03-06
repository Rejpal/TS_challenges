import {InputMetric, OutputMetric} from './types/metrics';

export interface ValidInput {
    inputMetrics: InputMetric[];
    outputMetric: OutputMetric;
    iterationCount: number;
    changeCountLimit: number;
}

export function validateLoadMonitoringSimulatorInput(
    args: any,
): args is ValidInput {
     const {inputMetrics, outputMetric, iterationCount, changeCountLimit } = args;

     inputMetrics.forEach((metric, index) => {
         if (!isValidInputMetric(metric)) {
             throw new Error(`InputMetric ${index} is not valid.`);
         }
     });

     if (!isValidOutputMetric(outputMetric)) {
         throw new Error(`Output Metric is not valid.`);
     }

     if (!(isPositiveInteger(iterationCount))) {
         throw new Error(`IterationCount is not valid.`);
     }

     if (!(isPositiveInteger(changeCountLimit))) {
         throw new Error(`changeCountLimit is not valid.`);
     }

     return true;
}

export function isNumberInsideBoundaries(input: any, min: number, max: number): input is number {
    return typeof input === 'number' && input >= min && input <= max;
}

export function isValidInputMetric(metric): metric is InputMetric {
    if (!metric) {
        return false;
    }

    const { changeStep, probabilityOfChange, minCriticalValue, maxCriticalValue, name } = metric;

    return (
        typeof name === 'string' &&
        isNumberInsideBoundaries(changeStep, -100, 100) &&
        isNumberInsideBoundaries(probabilityOfChange, 0, 100) &&
        isNumberInsideBoundaries(minCriticalValue, -100, 100) &&
        isNumberInsideBoundaries(maxCriticalValue, -100, 100) &&
        maxCriticalValue > minCriticalValue
    );
}

export function isValidOutputMetric(metric): metric is OutputMetric {
    if (!metric) {
        return false;
    }

    const {name, credit, price, minPrice, priceChangeStep} = metric;

    return (
        typeof name === 'string' &&
        typeof credit === 'number' && credit >= 0 &&
        typeof minPrice === 'number' && minPrice >= 0 &&
        typeof price === 'number' && price >= minPrice &&
        typeof priceChangeStep === 'number' && priceChangeStep >= 0
    );
}

export function isPositiveInteger(input: any): input is number {
    return typeof input === 'number' && input >= 0 && Number.isInteger(input);
}
