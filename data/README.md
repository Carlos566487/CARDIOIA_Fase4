# 🫀 CardioIA — Fase 4
## Pipeline de Engenharia de Dados e Estruturação de Datasets

Este repositório contém a documentação, estrutura e artefatos gerados durante a **Fase 4** do projeto **CardioIA**. Esta etapa foi de responsabilidade da equipe de Engenharia de Dados e Pipeline, focando na transformação, padronização e otimização de imagens médicas brutas para torná-las prontas para o treinamento de modelos de Visão Computacional (Redes Neurais Convolucionais).

---

## 🎯 1. Objetivo da Etapa

O objetivo principal desta fase foi estabelecer um pipeline robusto de processamento de dados capaz de transformar um conjunto heterogêneo de imagens médicas em um dataset altamente estruturado e padronizado. Essa preparação garante a compatibilidade e a eficiência para o treinamento subsequente de arquiteturas de *Deep Learning* (CNNs simples e modelos de *Transfer Learning*).

---

## 📊 2. Dataset Selecionado

Para o desenvolvimento e validação do pipeline, foi utilizado o **Brain Tumor MRI Dataset**. 

* **Características principais:** Publico, pré-estruturado e balanceado.
* **Volume total:** 7.200 imagens de ressonância magnética cerebral.
* **Classes:** Organizado em 4 classes de diagnóstico para classificação multiclasse:
  1. `Glioma`
  2. `Meningioma`
  3. `No Tumor` (Sem tumor)
  4. `Pituitary` (Tumor na hipófise)

---

## 🔍 3. Inspeção Inicial dos Dados

A análise exploratória inicial dos dados brutos revelou as seguintes características estruturais:
* **Divisão Original:** O dataset veio dividido em dois grandes blocos: `Training` (5.600 imagens) e `Testing` (1.600 imagens).
* **Distribuição Nativa:** Cada uma das 4 classes possuía exatamente 1.400 imagens no bloco de treino e 400 imagens no bloco de teste.
* **Formatos Técnicos:** Imagens em formato `.jpeg`, resolução majoritária de `512×512` pixels, codificadas em **Modo L** (escala de cinza de 8 bits).

---

## 🔧 4. Pipeline de Pré-processamento Aplicado

Para garantir a conformidade com os requisitos das arquiteturas modernas de redes neurais, foram aplicadas de forma automatizada as seguintes transformações:

1. **Conversão de Modo de Cor (Grayscale ➡️ RGB):** As imagens foram convertidas de escala de cinza para o espaço de cor RGB (3 canais). Essa etapa é crucial para permitir o uso de técnicas de *Transfer Learning* com modelos consagrados (ex: *VGG16, ResNet, MobileNet*), que exigem nativamente tensores de entrada tridimensionais.
2. **Redimensionamento Espacial:**
   Todas as imagens foram redimensionadas de forma fixa para **`224×224` pixels**, alinhando-se com o padrão de entrada das principais arquiteturas convolucionais de mercado.
3. **Divisão de Validação (*Split*):**
   Foi extraído um conjunto de validação (`Validation`) a partir do conjunto de treinamento original para apoiar a análise de convergência do modelo e evitar *overfitting*.
4. **Catalogação Automatizada:**
   Criação de um arquivo consolidado de metadados (`metadata_dataset.csv`) para rastreabilidade de caminhos de arquivos, rótulos e splits associados.

---

## 🗂️ 5. Estrutura e Distribuição Final do Dataset

Após a execução do pipeline de dados, o volume total de 7.200 imagens foi balanceado e redistribuído da seguinte forma:

| Classe | Treinamento (*Train*) | Validação (*Val*) | Teste (*Test*) | Total por Classe |
| :--- | :---: | :---: | :---: | :---: |
| **Glioma** | 1.190 | 210 | 400 | **1.800** |
| **Meningioma** | 1.190 | 210 | 400 | **1.800** |
| **No Tumor** | 1.190 | 210 | 400 | **1.800** |
| **Pituitary** | 1.190 | 210 | 400 | **1.800** |
| **TOTAL** | **4.760** | **840** | **1.600** | **7.200** |

---

## 📁 6. Arquitetura do Dataset Processado

Devido às restrições de tamanho de arquivos individuais e armazenamento direto no repositório do GitHub, os dados processados foram organizados e **compactados por classe**. Abaixo está representada a árvore de diretórios do ambiente:

```text
processed/
├── train/
│   ├── train_glioma.zip
│   ├── train_meningioma.zip
│   ├── train_notumor.zip
│   └── train_pituitary.zip
│
├── val/
│   ├── val_glioma.zip
│   ├── val_meningioma.zip
│   ├── val_notumor.zip
│   └── val_pituitary.zip
│
└── test/
    ├── test_glioma.zip
    ├── test_meningioma.zip
    ├── test_notumor.zip
    └── test_pituitary.zip
