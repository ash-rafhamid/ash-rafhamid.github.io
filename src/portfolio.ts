export const contact = {
  email: 'ashrafhamidmajumder@gmail.com',
  github: 'https://github.com/ash-rafhamid',
  linkedin: 'https://linkedin.com/in/ashrafhamid096',
}

export type Publication = {
  id: string
  venue: string
  type: string
  title: string
  description: string
  href?: string
  linkLabel?: string
  secondaryHref?: string
  abstract?: string
  topics: string[]
}

export const publications: Publication[] = [
  {
    id: 'icml',
    venue: 'ICML 2026 · MusIML',
    type: 'Workshop paper',
    title: 'FD-Loss: Supervised Feature Decorrelation as a Scale-Invariant Replacement for Random Dropout',
    description: 'Investigating supervised feature decorrelation as a scale-invariant alternative to random dropout.',
    href: 'https://icml.cc/virtual/2026/80194',
    linkLabel: 'View on ICML',
    secondaryHref: 'https://openreview.net/forum?id=A5D2DVEM8U',
    topics: ['Feature decorrelation', 'Regularization'],
  },
  {
    id: 'journal',
    venue: 'Journal / 2026',
    type: 'Accepted',
    title: 'An Explainable Ensemble Machine Learning Framework for Predicting IVIG Resistance in Kawasaki Disease',
    description: 'Explainable ensemble learning for predicting resistance to intravenous immunoglobulin treatment in Kawasaki disease.',
    href: 'https://doi.org/10.1016/j.meadig.2026.100056',
    linkLabel: 'View journal paper',
    topics: ['Ensemble learning', 'Explainable AI'],
  },
  {
    id: 'gait',
    venue: 'COMPAS 2026',
    type: 'Conference manuscript',
    title: 'Explaining Compound-Covariant Degradation in Gait Recognition through Feature-Space Collapse',
    description: 'Why do gait recognizers fail when clothing, carried objects and terrain change together? An explainability-first analysis across CCGR-Mini and Gait3D.',
    abstract: 'Gait recognition degrades sharply under real-world covariates such as clothing, carried objects, and terrain, and most severely when several covariates co-occur—yet why this happens is rarely examined. We present an explainability-first analysis of compound-covariate degradation on the CCGR-Mini benchmark. Rather than proposing a new recognizer, we use a deliberately simple Gait Energy Image pipeline as an analytical instrument. We find that recognition accuracy declines monotonically with the number of stacked covariates (Spearman rho = −0.77, p < 10⁻¹⁰), and we identify the mechanism as feature-space collapse: the identity margin between correct and incorrect gallery matches shrinks and inverts as covariates accumulate, tracking accuracy almost perfectly (r = 0.96). We further test and reject spatial-attention dispersion as an alternative explanation, localizing the failure to the learned representation. Finally, we show the mechanism generalizes to the in-the-wild Gait3D benchmark. Our analysis provides, to our knowledge, the first quantified per-covariate explanation of gait recognition failure, validated across two datasets.',
    topics: ['Computer vision', 'Explainability', 'Gait recognition'],
  },
  {
    id: 'otosfinet',
    venue: 'SPICSCON 2026',
    type: 'Conference manuscript',
    title: 'OtosFiNet: An Explainable Deep Learning-Based Approach for Automated Ear Disease Classification Using Otoscopic Images',
    description: 'A dual-stream InceptionV3 and NASNetMobile framework for five-category otoscopic image classification, evaluated with ten-fold cross-validation and Grad-CAM.',
    abstract: 'Middle ear disorders and cerumen impaction are among the most common ear conditions worldwide, and their early detection is essential for effective treatment and patient care. However, clinical diagnosis using standard otoscopy is often challenging due to complex, multiscale morphological variations and the limitations of standalone deep learning backbones. To address these issues, this study proposes a dual-stream deep learning framework named OtosFiNet for reliable classification of otoscopic conditions into five primary diagnostic categories. The approach integrates the spatial factorization capabilities of InceptionV3 with the structurally searched block representations of NASNetMobile inside a parallel extraction matrix. Multiple experiments using transfer learning were conducted using a clinical corpus of 3,000 otoscopic images under advanced spatial augmentation protocols. Ten-fold cross-validation ensured strong evaluation, while the explainable AI technique, Grad-CAM, was applied to highlight the influence of key visual markers. Experimental results show that the proposed method achieves superior classification with 98.8% accuracy, precision, recall, and F1 score, alongside an Area Under the Curve (AUC) of 0.999, outperforming performances obtained from the existing studies where validation was done and baseline models like ResNet50, VGG16, and the separated parent networks.',
    topics: ['Deep learning', 'Medical imaging', 'Grad-CAM'],
  },
]

export const skills = [
  { title: 'Languages', description: 'From a quick experiment to a complete application.', items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'SQL'] },
  { title: 'AI & machine learning', description: 'Training, evaluating and understanding models.', items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy', 'Computer vision', 'Explainable AI'] },
  { title: 'Web & product', description: 'Interfaces and systems that work together.', items: ['React', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'REST APIs', 'Chrome extensions'] },
  { title: 'Development tools', description: 'The everyday toolkit behind the work.', items: ['Git', 'GitHub', 'Firebase', 'Android Studio', 'Streamlit'] },
]
