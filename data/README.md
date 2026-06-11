CARDIOIA — FASE 4
Relatório Técnico — Engenheiro de Dados e Pipeline

1. Objetivo da Etapa

Esta etapa teve como objetivo preparar o conjunto de imagens médicas para utilização nos modelos de Visão Computacional do projeto CardioIA. A responsabilidade do Engenheiro de Dados e Pipeline foi transformar imagens brutas em dados organizados, padronizados e prontos para treinamento de redes neurais convolucionais.

2. Dataset Selecionado

Foi selecionado o Brain Tumor MRI Dataset, composto por 7.200 imagens de ressonância magnética cerebral organizadas em quatro classes: Glioma, Meningioma, No Tumor e Pituitary. A escolha foi feita por se tratar de um dataset público, estruturado, balanceado e adequado para classificação multiclasses em imagens médicas.

3. Inspeção Inicial dos Dados

A inspeção inicial identificou que o dataset original estava dividido em dois conjuntos principais: Training e Testing. Cada classe possuía 1.400 imagens no conjunto de treinamento e 400 imagens no conjunto de teste, totalizando 7.200 imagens. Também foi verificado que as imagens estavam em formato JPEG, majoritariamente com resolução 512×512 pixels, em modo L, ou seja, escala de cinza.

4. Pré-processamento Aplicado

Foram aplicadas as seguintes etapas de pré-processamento:

- Conversão das imagens de escala de cinza para RGB;
- Redimensionamento das imagens para 224×224 pixels;
- Organização das imagens em diretórios padronizados;
- Criação do conjunto de validação a partir do conjunto original de treinamento;
- Geração de arquivo metadata_dataset.csv contendo caminho da imagem, classe e split correspondente.

A conversão para RGB foi necessária para garantir compatibilidade com modelos de Transfer Learning, como VGG16, ResNet e MobileNet, que normalmente recebem imagens com três canais. O redimensionamento para 224×224 pixels foi adotado por ser um padrão amplamente utilizado em arquiteturas convolucionais pré-treinadas.

5. Estrutura Final do Dataset

Após o pipeline, o dataset processado ficou organizado em três conjuntos:

Train: 4.760 imagens
Validation: 840 imagens
Test: 1.600 imagens

Cada classe manteve distribuição balanceada:

Train: 1.190 imagens por classe
Validation: 210 imagens por classe
Test: 400 imagens por classe

Essa organização permite que o Cientista de IA utilize os dados diretamente no treinamento da CNN simples e dos modelos de Transfer Learning.

6. Limitações e Aspectos Éticos

Apesar de o dataset estar balanceado entre classes, não há informações detalhadas sobre idade, sexo, etnia, equipamento utilizado ou origem hospitalar das imagens. Isso limita análises de representatividade e impede avaliar possíveis vieses populacionais. Por isso, o modelo desenvolvido neste projeto deve ser interpretado apenas como protótipo acadêmico de apoio à decisão, não como ferramenta clínica definitiva.

7. Arquivos Entregues

Foram gerados os seguintes artefatos:

- processed_dataset.zip
- metadata_dataset.csv
- relatorio_pipeline.pdf
- distribuicao_dataset.png
- exemplos_classes.png
- antes_depois_preprocessamento.png
- dashboard_dataset_final.png

Com isso, a etapa de Engenharia de Dados e Pipeline foi concluída, entregando um dataset estruturado, validado e pronto para o treinamento dos modelos de classificação de imagens médicas.

## Entrega para o Cientista de IA

O conjunto de dados encontra-se totalmente preparado para treinamento de modelos de Deep Learning.

Características finais:

* Formato RGB
* Resolução padronizada em 224x224 pixels
* Normalização aplicada
* Dataset balanceado
* Divisão em:

  * Train (4.760 imagens)
  * Validation (840 imagens)
  * Test (1.600 imagens)

Classes disponíveis:

* Glioma
* Meningioma
* No Tumor
* Pituitary

Os dados estão organizados em estrutura compatível com TensorFlow/Keras e PyTorch, permitindo treinamento direto de modelos CNN e arquiteturas de Transfer Learning.

