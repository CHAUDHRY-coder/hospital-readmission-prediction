# 🏥 Hospital Readmission Prediction

This project aims to predict hospital readmissions within 30 days using patient encounter data. It includes preprocessing, feature engineering, EDA, model training, and prediction generation.

---

## 📊 Dataset

**Files:** `train.csv`, `test.csv`  
Each row = one hospital encounter.

**Key Features:**
- `STAY_FROM_DT`, `STAY_THRU_DT`: Admission/discharge dates  
- `AD_DGNS`, `DGNSCD01`–`DGNSCD25`: Diagnosis codes (ICD-10)  
- `PRCDRCD01`–`PRCDRCD25`: Procedure codes  
- `STUS_CD`, `TYPE_ADM`, `SRC_ADMS`, `STAY_DRG_CD`, `stay_drg_cd`  
- `Readmitted_30`: Target (1 = readmitted in 30 days)

**Challenges:**  
- High-dimensional data  
- Many missing values  
- Imbalanced target variable

---

## ⚙️ Methodology

1. **Preprocessing**
   - Remove `ID`, handle NaNs, replace placeholders (`'-'` → `0`)
   - Compute stay duration; add binary `Long_Stay`

2. **Feature Engineering**
   - Count diagnoses/procedures per row  
   - One-hot encode: `TYPE_ADM`, `SRC_ADMS`, `STUS_CD`  
   - Map DRG & diagnosis codes to clinical categories  
   - Create binary flags for top 200 frequent codes  
   - Convert all boolean features to integers

3. **EDA**
   - Visualize relationships between stay length, diagnoses, and readmission

4. **Modeling**
   - Train/test split (80/20)  
   - Models: XGBoost, LightGBM, Random Forest, Naive Bayes variants

5. **Evaluation**
   - Metrics: Accuracy, ROC AUC, Precision, Recall, F1  
   - Most models struggled with recall for minority class

6. **Prediction**
   - Apply pipeline to `test.csv`  
   - Generate `submission.csv` using Random Forest

---

## 🧪 Results

High accuracy, but low recall for readmissions due to class imbalance. Random Forest selected for submission. Discrepancies between models (e.g., RF vs. LightGBM) highlight difficulty of the task.

---

## 📁 Repo Contents

- `Readmission Prediction.ipynb` – Full notebook  
- `Data/train.csv`, `Data/test.csv` – Dataset files  
- `Data/metaData.csv` – Column descriptions  
- `submission.csv` – Output predictions  
- `README.md` – Project overview

---

## 🚀 Getting Started

1. **Install requirements:**
   ```bash
   pip install pandas numpy matplotlib seaborn scikit-learn xgboost lightgbm
   ```
2. **Run the notebook** in Jupyter or Google Colab  
3. **Execute all cells** and generate `submission.csv`