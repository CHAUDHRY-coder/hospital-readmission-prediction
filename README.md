# Hospital Readmission Prediction

This project demonstrates an end-to-end process for predicting hospital readmissions within 30 days based on patient encounter data. The notebook includes data preprocessing, feature engineering to handle complex medical codes and time-series information, exploratory data analysis, model training, and generating predictions for a test dataset.

Predicting readmissions is a crucial task in healthcare to improve patient outcomes and reduce costs. However, it often involves dealing with complex, high-dimensional data and class imbalance.

## Dataset

The dataset is provided in two CSV files: `train.csv` and `test.csv`. Each row represents a hospital encounter.

Key columns include:

*   `ID`: Unique identifier for the encounter (removed during preprocessing).
*   `STAY_FROM_DT`, `STAY_THRU_DT`: Admission and discharge dates (used to calculate stay duration).
*   `STUS_CD`: Patient status code at discharge.
*   `TYPE_ADM`: Type of admission.
*   `SRC_ADMS`: Source of admission.
*   `AD_DGNS`: Principal diagnosis code (ICD-10).
*   `DGNSCD01` - `DGNSCD25`: Additional diagnosis codes (ICD-10).
*   `PRCDRCD01` - `PRCDRCD25`: Procedure codes (ICD-10-PCS).
*   `STAY_DRG_CD`, `stay_drg_cd`: Diagnosis Related Group codes.
*   `Readmitted_30` (in `train.csv` only): Target variable (1 if readmitted within 30 days, 0 otherwise).

The dataset exhibits significant missing values, particularly in the extensive lists of diagnosis and procedure codes. The target variable (`Readmitted_30`) is also highly imbalanced, which is a common challenge in readmission prediction.

## Methodology

The project follows these main steps:

1.  **Data Loading and Initial Cleaning:** Load the data using pandas and remove the unique `ID` column. Inspect for missing values.
2.  **Missing Value Handling:**
    *   Missing values in diagnosis (`DGNSCDxx`) and procedure (`PRCDRCDxx`) columns are imputed with `0`, assuming that missing entries beyond the first indicate the absence of further diagnoses/procedures in that record.
    *   Hyphen ('-') values, likely placeholders for missing/N/A, are also replaced with `0`.
3.  **Feature Engineering:**
    *   **Length of Stay:** Calculate the duration of the hospital stay in days from admission and discharge dates. A binary feature `Long_Stay` is created for stays longer than 7 days.
    *   **Count Features:** Create features for the total number of recorded diagnoses and procedures for each encounter by counting non-zero entries in the respective code columns.
    *   **Categorical Encoding:**
        *   `TYPE_ADM`, `SRC_ADMS`, and `STUS_CD` are one-hot encoded.
        *   The two DRG code columns (`STAY_DRG_CD`, `stay_drg_cd`) are combined into a single `STAY_DRG` feature (prioritizing `STAY_DRG_CD` when both exist).
        *   The `STAY_DRG` is mapped to broader DRG clinical categories and one-hot encoded.
        *   The principal diagnosis (`AD_DGNS`) is mapped to broader ICD-10 clinical categories and one-hot encoded.
    *   **High-Cardinality Feature Handling:** Binary flag features are created for the top 200 most frequent diagnosis codes and the top 200 most frequent procedure codes found in the training data. This captures the influence of common codes without generating an extremely sparse dataset from one-hot encoding all unique codes.
    *   Convert boolean columns resulting from one-hot encoding to integer type.
4.  **Exploratory Data Analysis (EDA):** Basic visualizations are used to understand the relationship between the number of diagnoses/procedures, length of stay, and the readmission status.
5.  **Model Training:**
    *   The processed training data is split into training and testing sets (80/20 split).
    *   Multiple classification models are trained on the training set: XGBoost, Random Forest, LightGBM, Multinomial Naive Bayes, Gaussian Naive Bayes, Bernoulli Naive Bayes, and Complement Naive Bayes.
6.  **Model Evaluation:** Models are evaluated on the test set using:
    *   Accuracy
    *   ROC AUC
    *   Classification Report (Precision, Recall, F1-score)
    The evaluation reveals that despite high overall accuracy, most models struggle to correctly identify the minority class (readmissions), as indicated by low Recall and F1-scores for class 1. Gaussian Naive Bayes shows high recall but very low precision.
7.  **Prediction and Submission:**
    *   The same preprocessing steps are applied to the `test.csv` dataset.
    *   Predictions for the `Readmitted_30` variable are generated using the trained Random Forest Classifier.
    *   A submission file (`submission.csv`) is created with the 'ID' and the predicted 'Readmitted_30' values.

## Results

The initial models tested showed high overall accuracy but highlighted the significant challenge posed by the class imbalance – predicting actual readmissions (the minority class) proved difficult, with most models achieving low recall and F1-scores for this class. The Random Forest model was selected for the final submission, although its performance on the minority class was limited. The comparison between Random Forest and LightGBM predictions on the test set revealed substantial disagreements, indicating that different models capture different patterns in the data and struggle with the imbalanced prediction task in different ways.

## Files in this Repository

*   `SOFTEC_(1)_(1) (3).ipynb`: The main Jupyter Notebook containing all the code for data processing, feature engineering, modeling, evaluation, and prediction.
*   `train.csv`: The training data file.
*   `test.csv`: The test data file for generating predictions.
*   `submission.csv`: The generated submission file with predicted readmission status for the test data (created after running the notebook).
*   `README.md`: This file.

## Getting Started

To run the notebook and reproduce the results:

1.  **Prerequisites:** Ensure you have Python installed along with the following libraries:
    *   `pandas`
    *   `numpy`
    *   `matplotlib`
    *   `seaborn`
    *   `scikit-learn` (`sklearn`)
    *   `xgboost`
    *   `lightgbm`

    You can install them using pip:
    ```bash
    pip install pandas numpy matplotlib seaborn scikit-learn xgboost lightgbm
    ```
2.  **Clone the Repository:** Clone this GitHub repository to your local machine.
3.  **Open in Jupyter:** Open the `SOFTEC_(1)_(1) (3).ipynb` file in a Jupyter Notebook environment (Jupyter Notebook, JupyterLab, or Google Colab).
4.  **Run Cells:** Execute the notebook cells sequentially from top to bottom.
5.  **Generate Submission:** The notebook will generate a `submission.csv` file in the same directory containing the predicted readmission status for the test dataset.

## Future Work

*   Implement techniques to explicitly address class imbalance (e.g., oversampling the minority class with SMOTE, undersampling the majority class).
*   Perform systematic hyperparameter tuning for the promising models (XGBoost, LightGBM, Random Forest) using techniques like Grid Search or Randomized Search with cross-validation, optimizing for metrics like ROC AUC or F1-score (for the minority class).
*   Explore other advanced models suitable for tabular data and imbalanced classification.
*   Investigate feature importance from tree-based models to understand which factors are most predictive.
*   Consider using advanced methods for encoding high-cardinality categorical features like target encoding or embeddings for the diagnosis and procedure codes.
*   Analyze the cases where models disagree to gain further insights into the data and model limitations.
