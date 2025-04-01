document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM content loaded - initializing application");
    
    // Set up direct template card selection on page load
    setupTemplateSelection();
    
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    
    // Add metric button functionality
    const addMetricBtn = document.getElementById('addMetricBtn');
    if (addMetricBtn) {
        addMetricBtn.addEventListener('click', function() {
            addMetricItem();
        });
        
        // Initialize remove metric buttons
        initMetricRemoveButtons();
    }

    // Handle form wizard navigation
    const wizardNavLinks = document.querySelectorAll('.form-wizard .nav-link');
    const wizardContents = document.querySelectorAll('.tab-pane.wizard-pane');
    const wizardNextBtns = document.querySelectorAll('.wizard-next-btn');
    const wizardPrevBtns = document.querySelectorAll('.wizard-prev-btn');

    if (wizardNavLinks.length > 0) {
        wizardNavLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showWizardStep(index);
            });
        });

        if (wizardNextBtns.length > 0) {
            wizardNextBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const currentStep = findCurrentWizardStep();
                    if (currentStep < wizardNavLinks.length - 1) {
                        showWizardStep(currentStep + 1);
                    }
                });
            });
        }

        if (wizardPrevBtns.length > 0) {
            wizardPrevBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const currentStep = findCurrentWizardStep();
                    if (currentStep > 0) {
                        showWizardStep(currentStep - 1);
                    }
                });
            });
        }
    }

    function showWizardStep(stepIndex) {
        // Update navigation links
        wizardNavLinks.forEach((link, i) => {
            if (i === stepIndex) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update content panes
        wizardContents.forEach((content, i) => {
            if (i === stepIndex) {
                content.classList.add('active', 'show');
            } else {
                content.classList.remove('active', 'show');
            }
        });

        // Update progress bar if exists
        const progressBar = document.querySelector('.wizard-progress .progress-bar');
        if (progressBar) {
            const progressPercentage = ((stepIndex + 1) / wizardNavLinks.length) * 100;
            progressBar.style.width = progressPercentage + '%';
            progressBar.setAttribute('aria-valuenow', progressPercentage);
        }
        
        // Log navigation for debugging
        console.log('Navigating to step', stepIndex + 1);
    }

    function findCurrentWizardStep() {
        for (let i = 0; i < wizardNavLinks.length; i++) {
            if (wizardNavLinks[i].classList.contains('active')) {
                return i;
            }
        }
        return 0;
    }

    // Handle template selection with buttons
    console.log("Setting up template selection buttons");
    const templateButtons = document.querySelectorAll('.select-template-btn');
    console.log("Found template buttons:", templateButtons.length);
    
    if (templateButtons.length > 0) {
        templateButtons.forEach(button => {
            button.addEventListener('click', function() {
                const templateId = this.getAttribute('data-template-id');
                console.log(`Template selected via button: ${templateId}`);
                
                // Store the selected template ID
                const selectedTemplateInput = document.getElementById('selectedTemplate');
                if (selectedTemplateInput) {
                    selectedTemplateInput.value = templateId;
                }
                
                // Visual feedback - change button appearance
                templateButtons.forEach(btn => {
                    btn.classList.remove('btn-success');
                    btn.classList.add('btn-primary');
                    btn.textContent = 'Select Template';
                });
                
                this.classList.remove('btn-primary');
                this.classList.add('btn-success');
                this.textContent = 'Selected ✓';
                
                // Show success message
                const alertEl = document.getElementById('templateSelectedAlert');
                if (alertEl) {
                    alertEl.classList.remove('d-none');
                }
                
                // Enable the continue button
                const nextBtn = document.querySelector('.template-next-btn');
                if (nextBtn) {
                    nextBtn.disabled = false;
                    nextBtn.classList.remove('btn-secondary');
                    nextBtn.classList.add('btn-primary');
                }
                
                // Pre-fill form data
                preloadTemplateData(templateId);
            });
        });
    } else {
        console.error("No template buttons found");
    }

    // Function to preload form data based on selected template
    // Make preloadTemplateData available globally
    window.preloadTemplateData = preloadTemplateData;
    
    function preloadTemplateData(templateId) {
        // Medical Coding Review Agent template
        if (templateId === 'medical-coding') {
            // Set agent name and description
            document.getElementById('agentName').value = 'Medical Coding Review Agent';
            document.getElementById('agentDescription').value = 'An AI agent that reviews medical procedure and diagnostic codes for errors and compliance.';
            
            // Set capabilities
            if (document.getElementById('capabilityMedicalCoding')) {
                document.getElementById('capabilityMedicalCoding').checked = true;
            }
            
            // Set knowledge base
            if (document.getElementById('knowledgeICD10')) {
                document.getElementById('knowledgeICD10').checked = true;
            }
            if (document.getElementById('knowledgeCPT')) {
                document.getElementById('knowledgeCPT').checked = true;
            }
            
            // Set primary goal for OODA loop
            if (document.getElementById('primaryGoal')) {
                document.getElementById('primaryGoal').value = 'Reduce medical coding errors by 30% while maintaining throughput';
            }
            
            // Set secondary goals
            if (document.getElementById('secondaryGoals')) {
                document.getElementById('secondaryGoals').value = 'Improve compliance rate, Accelerate claim processing, Reduce claim denials';
            }
            
            // Set constraints
            if (document.getElementById('constraintsDef')) {
                document.getElementById('constraintsDef').value = 'Must comply with HIPAA, Must process each code within 3 seconds';
            }
            
            // Clear existing metrics
            const metricSection = document.getElementById('metricsDynamicSection');
            if (metricSection) {
                metricSection.innerHTML = '';
                
                // Add medical coding specific metrics
                addPredefinedMetric('Error Rate', 'percentage');
                addPredefinedMetric('Claim Denial Rate', 'percentage');
                addPredefinedMetric('Processing Time', 'time');
                addPredefinedMetric('Compliance Score', 'score');
            }
        } 
        // Customer Support Agent template
        else if (templateId === 'customer-support') {
            document.getElementById('agentName').value = 'Customer Support Agent';
            document.getElementById('agentDescription').value = 'An AI agent that handles customer inquiries and provides product support.';
            
            // Set capabilities
            if (document.getElementById('capabilityQA')) {
                document.getElementById('capabilityQA').checked = true;
            }
            
            // Set knowledge base
            if (document.getElementById('knowledgeProductInfo')) {
                document.getElementById('knowledgeProductInfo').checked = true;
            }
            
            // Set primary goal for OODA loop
            if (document.getElementById('primaryGoal')) {
                document.getElementById('primaryGoal').value = 'Increase customer satisfaction score by 15%';
            }
            
            // Set secondary goals
            if (document.getElementById('secondaryGoals')) {
                document.getElementById('secondaryGoals').value = 'Reduce ticket escalations, Increase first-contact resolution rate';
            }
            
            // Set constraints
            if (document.getElementById('constraintsDef')) {
                document.getElementById('constraintsDef').value = 'Response time under 30 seconds, Must maintain brand voice';
            }
            
            // Clear existing metrics
            const metricSection = document.getElementById('metricsDynamicSection');
            if (metricSection) {
                metricSection.innerHTML = '';
                
                // Add customer support specific metrics
                addPredefinedMetric('Customer Satisfaction', 'score');
                addPredefinedMetric('Resolution Time', 'time');
                addPredefinedMetric('Escalation Rate', 'percentage');
            }
        }
        // Data Analysis Agent template
        else if (templateId === 'data-analysis') {
            document.getElementById('agentName').value = 'Data Analysis Agent';
            document.getElementById('agentDescription').value = 'An AI agent that processes and analyzes data, presenting insights and visualizations.';
            
            // Set capabilities
            if (document.getElementById('capabilityDataAnalysis')) {
                document.getElementById('capabilityDataAnalysis').checked = true;
            }
            
            // Set knowledge base
            if (document.getElementById('knowledgeStatistics')) {
                document.getElementById('knowledgeStatistics').checked = true;
            }
            
            // Set primary goal for OODA loop
            if (document.getElementById('primaryGoal')) {
                document.getElementById('primaryGoal').value = 'Provide actionable insights with 90% confidence level';
            }
            
            // Set secondary goals
            if (document.getElementById('secondaryGoals')) {
                document.getElementById('secondaryGoals').value = 'Reduce analysis time, Improve visualization clarity, Identify hidden patterns';
            }
            
            // Set constraints
            if (document.getElementById('constraintsDef')) {
                document.getElementById('constraintsDef').value = 'Process datasets up to 10GB, Generate reports within 5 minutes';
            }
            
            // Clear existing metrics
            const metricSection = document.getElementById('metricsDynamicSection');
            if (metricSection) {
                metricSection.innerHTML = '';
                
                // Add data analysis specific metrics
                addPredefinedMetric('Analysis Accuracy', 'percentage');
                addPredefinedMetric('Processing Time', 'time');
                addPredefinedMetric('Insight Quality', 'score');
                addPredefinedMetric('Model Confidence', 'percentage');
            }
        }
    }

    // Generate YAML output based on form input
    const generateYamlBtn = document.getElementById('generateYaml');
    if (generateYamlBtn) {
        generateYamlBtn.addEventListener('click', () => {
            generateYamlOutput();
        });
    }

    function generateYamlOutput() {
        const yamlOutput = document.getElementById('yamlOutput');
        if (!yamlOutput) return;

        // Get form values
        const agentName = document.getElementById('agentName')?.value || 'Custom Agent';
        const agentDescription = document.getElementById('agentDescription')?.value || 'A custom AMI agent';
        
        // Get selected capabilities
        const capabilities = [];
        document.querySelectorAll('input[name="capabilities"]:checked').forEach(input => {
            capabilities.push(input.value);
        });
        
        // Get selected knowledge bases
        const knowledgeBases = [];
        document.querySelectorAll('input[name="knowledge"]:checked').forEach(input => {
            knowledgeBases.push(input.value);
        });

        // Get model settings
        const modelType = document.getElementById('modelType')?.value || 'llm';
        const contextSize = document.getElementById('contextSize')?.value || 16000;
        const temperature = document.getElementById('temperature')?.value || 0.7;
        
        // Get OODA Loop settings
        const primaryGoal = document.getElementById('primaryGoal')?.value || '';
        const secondaryGoals = document.getElementById('secondaryGoals')?.value || '';
        const constraints = document.getElementById('constraintsDef')?.value || '';
        const adaptationLevel = document.getElementById('adaptationLevel')?.value || 'strategy';
        const adaptationRate = document.getElementById('adaptationRate')?.value || 0.5;
        const feedbackInterval = document.getElementById('feedbackInterval')?.value || 'daily';
        
        // Build metrics array
        const metrics = [];
        document.querySelectorAll('.metric-item').forEach(item => {
            const name = item.querySelector('input').value;
            const type = item.querySelector('select').value;
            if (name && type && type !== 'Type') {
                metrics.push({name, type});
            }
        });
        
        // Get advanced OODA parameters
        const oodaParams = {
            observation: {
                trackUserFeedback: document.getElementById('trackUserFeedback')?.checked || false,
                trackSystemMetrics: document.getElementById('trackSystemMetrics')?.checked || false,
                trackExternalEvents: document.getElementById('trackExternalEvents')?.checked || false
            },
            orientation: {
                useHistoricalData: document.getElementById('useHistoricalData')?.checked || false,
                useBayesianUpdates: document.getElementById('useBayesianUpdates')?.checked || false
            },
            decision: {
                useMultiArmBandit: document.getElementById('useMultiArmBandit')?.checked || false,
                useThompsonSampling: document.getElementById('useThompsonSampling')?.checked || false
            },
            action: {
                recordAllActions: document.getElementById('recordAllActions')?.checked || false,
                implementGradualChanges: document.getElementById('implementGradualChanges')?.checked || false
            }
        };

        // Generate YAML string
        const yaml = `model: ${generateSlug(agentName)}
label:
  en_US: ${agentName}
model_type: ${modelType}
features:
${capabilities.map(cap => `- ${cap}`).join('\n')}
description:
  en_US: ${agentDescription}
knowledge_bases:
${knowledgeBases.map(kb => `- ${kb}`).join('\n')}
model_properties:
  mode: chat
  context_size: ${contextSize}
parameter_rules:
- name: temperature
  use_template: temperature
  default: ${temperature}
- name: top_p
  use_template: top_p
  default: 0.9
- name: max_tokens
  use_template: max_tokens
  default: 1024
# Ailevate Adaptive Framework (OODA Loop)
adaptive_framework:
  enabled: true
  goals:
    primary: "${primaryGoal}"
    secondary: [${secondaryGoals.split(',').map(g => `"${g.trim()}"`).filter(g => g !== '""').join(', ')}]
    constraints: [${constraints.split(',').map(c => `"${c.trim()}"`).filter(c => c !== '""').join(', ')}]
  metrics:
${metrics.map(m => `    - name: "${m.name}"\n      type: ${m.type}`).join('\n')}
  adaptation:
    level: ${adaptationLevel}
    rate: ${adaptationRate}
    feedback_interval: ${feedbackInterval}
  ooda_configuration:
    observe:
      track_user_feedback: ${oodaParams.observation.trackUserFeedback}
      track_system_metrics: ${oodaParams.observation.trackSystemMetrics}
      track_external_events: ${oodaParams.observation.trackExternalEvents}
    orient:
      use_historical_data: ${oodaParams.orientation.useHistoricalData}
      use_bayesian_updates: ${oodaParams.orientation.useBayesianUpdates}
    decide:
      use_multi_arm_bandit: ${oodaParams.decision.useMultiArmBandit}
      use_thompson_sampling: ${oodaParams.decision.useThompsonSampling}
    act:
      record_all_actions: ${oodaParams.action.recordAllActions}
      implement_gradual_changes: ${oodaParams.action.implementGradualChanges}
pricing:
  input: '0.00'
  output: '0.00'
  unit: '0.000001'
  currency: USD
`;

        // Display formatted YAML
        yamlOutput.innerHTML = formatYamlWithSyntaxHighlighting(yaml);
        
        // Show the output section
        document.getElementById('yamlOutputSection').classList.remove('d-none');
    }

    function formatYamlWithSyntaxHighlighting(yaml) {
        // Simple syntax highlighting for YAML
        return yaml
            .replace(/^([\\w-]+):/gm, '<span class="yaml-key">$1:</span>')
            .replace(/: "?([^"\\n]+)"?$/gm, ': <span class="yaml-string">$1</span>')
            .replace(/: ([0-9]+(?:\\.[0-9]+)?)$/gm, ': <span class="yaml-number">$1</span>')
            .replace(/\\n/g, '<br>');
    }

    // Handle agent preview in the simulation
    const simulateBtn = document.getElementById('simulateAgent');
    if (simulateBtn) {
        console.log("Found Basic Simulation button, adding event listener");
        simulateBtn.addEventListener('click', () => {
            simulateAgentInteraction();
        });
    }
    
    // Handle OODA loop simulation
    const simulateOODABtn = document.getElementById('simulateOODA');
    if (simulateOODABtn) {
        console.log("Found OODA Loop Simulation button, adding event listener");
        simulateOODABtn.addEventListener('click', () => {
            console.log("OODA Loop Simulation button clicked");
            simulateOODALoop();
        });
    } else {
        console.error("Could not find simulateOODA button");
    }

    function simulateAgentInteraction() {
        console.log("simulateAgentInteraction called");
        const agentPreview = document.getElementById('agentPreview');
        if (!agentPreview) return;

        // Get agent name
        const agentName = document.getElementById('agentName').value || 'AMI Agent';
        
        // Get selected capabilities to determine response type
        const capabilities = [];
        document.querySelectorAll('input[name="capabilities"]:checked').forEach(input => {
            capabilities.push(input.value);
        });
        
        // Show the preview section and hide OODA metrics
        document.getElementById('previewSection').classList.remove('d-none');
        document.getElementById('oodaMetrics').classList.add('d-none');
        
        // Clear previous messages
        agentPreview.innerHTML = '';
        
        // Add user message
        addMessageToPreview('user', 'Can you help me with a task?');
        
        // Simulate typing with delay
        setTimeout(() => {
            // Generate a response based on selected capabilities
            let response = `Hello! I'm ${agentName}, your AI assistant. `;
            
            if (capabilities.includes('medical-coding')) {
                response += "I can help you review medical procedure and diagnostic codes for errors, compliance issues, and optimization opportunities.";
                
                // Add follow-up messages for medical coding
                setTimeout(() => {
                    addMessageToPreview('user', 'Can you check if code J20.9 is correctly paired with procedure 31575?');
                    
                    setTimeout(() => {
                        addMessageToPreview('agent', "I've reviewed the codes you provided. J20.9 represents 'Acute bronchitis, unspecified' while 31575 is the code for 'Laryngoscopy, flexible; diagnostic'. These codes can be used together if the laryngoscopy was performed to evaluate symptoms related to the bronchitis. However, you might want to consider a more specific respiratory code if the laryngoscopy was specifically examining the bronchial area. Would you like me to suggest some alternative coding options?");
                    }, 1500);
                }, 1500);
            } 
            else if (capabilities.includes('data-analysis')) {
                response += "I can help you analyze data sets, identify patterns, and generate visualizations and insights.";
                
                // Add follow-up messages for data analysis
                setTimeout(() => {
                    addMessageToPreview('user', 'I have a CSV with patient admission data. Can you analyze trends over the past year?');
                    
                    setTimeout(() => {
                        addMessageToPreview('agent', "I'd be happy to analyze your patient admission data. Please upload the CSV file and I'll identify key trends from the past year, including seasonal patterns, admission types, demographics, and length-of-stay metrics. I can also create visualizations to help you better understand the patterns in your data.");
                    }, 1500);
                }, 1500);
            }
            else if (capabilities.includes('qa')) {
                response += "I can answer questions about your products and services based on my knowledge base.";
                
                // Add follow-up messages for QA
                setTimeout(() => {
                    addMessageToPreview('user', 'What are your current subscription options?');
                    
                    setTimeout(() => {
                        addMessageToPreview('agent', "We currently offer three subscription tiers: Basic ($9.99/month) which includes essential features, Pro ($19.99/month) with advanced analytics and priority support, and Enterprise (custom pricing) for organizations needing dedicated resources and custom integrations. All plans come with a 14-day free trial. Would you like more details about any specific plan?");
                    }, 1500);
                }, 1500);
            }
            else {
                response += "I'm here to assist you with any questions or tasks within my capabilities.";
                
                // Add generic follow-up messages
                setTimeout(() => {
                    addMessageToPreview('user', 'What can you help me with?');
                    
                    setTimeout(() => {
                        addMessageToPreview('agent', "I can assist with a variety of tasks based on my configuration. Please let me know what specific help you need, and I'll do my best to assist you or direct you to the right resources.");
                    }, 1500);
                }, 1500);
            }
            
            addMessageToPreview('agent', response);
            
        }, 1000);
    }

    function simulateOODALoop() {
        console.log("simulateOODALoop function called");
        
        // Get DOM elements
        const agentPreview = document.getElementById('agentPreview');
        if (!agentPreview) {
            console.error("agentPreview element not found");
            return;
        }
        
        const previewSection = document.getElementById('previewSection');
        if (!previewSection) {
            console.error("previewSection element not found");
            return;
        }
        
        const oodaMetrics = document.getElementById('oodaMetrics');
        if (!oodaMetrics) {
            console.error("oodaMetrics element not found");
            return;
        }
        
        // Get agent name and goals
        const agentName = document.getElementById('agentName')?.value || 'AMI Agent';
        const primaryGoal = document.getElementById('primaryGoal')?.value || 'Improve performance metrics';
        
        let capabilities = [];
        document.querySelectorAll('input[name="capabilities"]:checked').forEach(input => {
            capabilities.push(input.value);
        });
        
        // Show the preview section and OODA metrics
        previewSection.classList.remove('d-none');
        oodaMetrics.classList.remove('d-none');
        
        // Clear previous messages
        agentPreview.innerHTML = '';
        
        // Reset metrics
        const adaptationCycle = document.getElementById('adaptationCycle');
        const performanceMetric = document.getElementById('performanceMetric');
        const currentStrategy = document.getElementById('currentStrategy');
        const goalProgress = document.getElementById('goalProgress');
        const goalProgressBar = document.getElementById('goalProgressBar');
        
        if (adaptationCycle) adaptationCycle.textContent = '1';
        if (performanceMetric) performanceMetric.textContent = '65%';
        if (currentStrategy) currentStrategy.textContent = 'S1';
        if (goalProgress) goalProgress.textContent = '0%';
        if (goalProgressBar) {
            goalProgressBar.style.width = '0%';
            goalProgressBar.setAttribute('aria-valuenow', '0');
        }
        
        // Initial system message
        addSystemMessage(`OODA Loop Simulation Started: Goal is to "${primaryGoal}"`);
        
        // CYCLE 1: Initial performance
        setTimeout(() => {
            // OBSERVE stage
            addSystemMessage("OBSERVE: Collecting initial performance data and user feedback...");
            
            // User interaction
            setTimeout(() => {
                if (capabilities.includes('medical-coding')) {
                    addMessageToPreview('user', 'I need to review these ICD-10 codes for a patient with respiratory issues');
                    
                    setTimeout(() => {
                        addMessageToPreview('agent', "I'll help you review those codes. Let me know which specific codes you're working with, and I can verify their accuracy and suggest alternatives if needed.");
                        
                        // User provides feedback
                        setTimeout(() => {
                            addMessageToPreview('user', 'Looking at J20.9 for acute bronchitis - is this the most specific code we could use?');
                            
                            setTimeout(() => {
                                addMessageToPreview('agent', "J20.9 is for 'Acute bronchitis, unspecified'. If you have more specific information about the causative agent, you could use a more specific code like J20.0 for Mycoplasma pneumoniae, J20.1 for Haemophilus influenzae, etc. Without that information, J20.9 is appropriate.");
                                
                                // ORIENT stage
                                setTimeout(() => {
                                    addSystemMessage("ORIENT: Analyzing performance data against goal...");
                                    addSystemMessage("Performance analysis: Code accuracy 65%, throughput 12 codes/min");
                                    updatePerformanceMetrics('65%', '0%', 'S1', '1');
                                    
                                    // DECIDE stage
                                    setTimeout(() => {
                                        addSystemMessage("DECIDE: Current strategy (S1: Basic knowledge retrieval) is sub-optimal. Switching to more context-aware approach (S2).");
                                        
                                        // ACT stage
                                        setTimeout(() => {
                                            addSystemMessage("ACT: Implementing strategy S2 (context-aware code validation)");
                                            updatePerformanceMetrics('65%', '15%', 'S2', '1');
                                            
                                            // Begin cycle 2
                                            runCycle2();
                                        }, 2000);
                                    }, 2000);
                                }, 2000);
                            }, 1500);
                        }, 1500);
                    }, 1500);
                }
                else if (capabilities.includes('data-analysis')) {
                    addMessageToPreview('user', 'Can you analyze this patient admission dataset and find patterns?');
                    
                    setTimeout(() => {
                        addMessageToPreview('agent', "I'd be happy to analyze your patient admission data. Please upload the CSV file, and I'll examine it for patterns and trends.");
                        
                        // User provides feedback
                        setTimeout(() => {
                            addMessageToPreview('user', 'I notice your analysis missed the seasonal patterns. Can you look at monthly variations?');
                            
                            setTimeout(() => {
                                addMessageToPreview('agent', "You're right, I should have included seasonal patterns. Let me re-analyze the data by month to identify any seasonal variations in admissions. This could reveal important cyclical patterns we might have missed.");
                                
                                // ORIENT stage
                                setTimeout(() => {
                                    addSystemMessage("ORIENT: Analyzing performance data against goal...");
                                    addSystemMessage("Performance analysis: Analysis completeness 65%, insight relevance 58%");
                                    updatePerformanceMetrics('65%', '0%', 'S1', '1');
                                    
                                    // DECIDE stage
                                    setTimeout(() => {
                                        addSystemMessage("DECIDE: Current strategy (S1: Basic statistical analysis) is missing temporal patterns. Switching to time-series analysis (S2).");
                                        
                                        // ACT stage
                                        setTimeout(() => {
                                            addSystemMessage("ACT: Implementing strategy S2 (time-series analysis with seasonal decomposition)");
                                            updatePerformanceMetrics('65%', '15%', 'S2', '1');
                                            
                                            // Begin cycle 2
                                            runCycle2();
                                        }, 2000);
                                    }, 2000);
                                }, 2000);
                            }, 1500);
                        }, 1500);
                    }, 1500);
                }
                else {
                    // Generic OODA simulation for other agent types
                    addMessageToPreview('user', 'I need help with a complex task in my domain.');
                    
                    setTimeout(() => {
                        addMessageToPreview('agent', `I'm here to assist with your ${capabilities.length > 0 ? capabilities[0] : ''} needs. What specific information can I help you with?`);
                        
                        // User provides feedback
                        setTimeout(() => {
                            addMessageToPreview('user', 'Your answer was helpful, but could you provide more specific guidance?');
                            
                            setTimeout(() => {
                                addMessageToPreview('agent', "You're right, I should be more specific. To better assist you, I'll need more details about your task. Once you provide those details, I can give you tailored guidance for your specific situation.");
                                
                                // ORIENT stage
                                setTimeout(() => {
                                    addSystemMessage("ORIENT: Analyzing performance data against goal...");
                                    addSystemMessage("Performance analysis: Response quality 65%, specificity 53%");
                                    updatePerformanceMetrics('65%', '0%', 'S1', '1');
                                    
                                    // DECIDE stage
                                    setTimeout(() => {
                                        addSystemMessage("DECIDE: Current strategy (S1: General knowledge) needs improvement. Switching to inquiry-based approach (S2).");
                                        
                                        // ACT stage
                                        setTimeout(() => {
                                            addSystemMessage("ACT: Implementing strategy S2 (targeted inquiry for context-building)");
                                            updatePerformanceMetrics('65%', '15%', 'S2', '1');
                                            
                                            // Begin cycle 2
                                            runCycle2();
                                        }, 2000);
                                    }, 2000);
                                }, 2000);
                            }, 1500);
                        }, 1500);
                    }, 1500);
                }
            }, 1500);
        }, 500);
        
        // CYCLE 2: Improved performance with first adaptation
        function runCycle2() {
            // Start cycle 2
            setTimeout(() => {
                updatePerformanceMetrics('72%', '25%', 'S2', '2');
                addSystemMessage("CYCLE 2: Testing new strategy...");
                
                // User interaction with improved agent
                setTimeout(() => {
                    if (capabilities.includes('medical-coding')) {
                        addMessageToPreview('user', 'Patient has documented bacterial pneumonia with Streptococcus. What codes should I use?');
                        
                        setTimeout(() => {
                            addMessageToPreview('agent', "For bacterial pneumonia due to Streptococcus, you should use J15.4 (Pneumonia due to Streptococcus). Since you specified documentation of the bacterial cause, this more specific code is more appropriate than the unspecified code J18.9. You might also want to add the specific Streptococcus code (such as B95.0-B95.5) as a secondary code if that information is available in the documentation.");
                            
                            // ORIENT stage for cycle 2
                            setTimeout(() => {
                                addSystemMessage("ORIENT: Analyzing updated performance...");
                                addSystemMessage("Performance analysis: Code accuracy improved to 72%, throughput maintained at 12 codes/min");
                                
                                // DECIDE stage for cycle 2
                                setTimeout(() => {
                                    addSystemMessage("DECIDE: Strategy S2 shows improvement but still below target. Enhancing with strategy S3 (predictive coding suggestions).");
                                    
                                    // ACT stage for cycle 2
                                    setTimeout(() => {
                                        addSystemMessage("ACT: Implementing strategy S3 (predictive coding with common co-occurrences)");
                                        updatePerformanceMetrics('72%', '35%', 'S3', '2');
                                        
                                        // Begin cycle 3
                                        runCycle3();
                                    }, 2000);
                                }, 2000);
                            }, 2000);
                        }, 1500);
                    } 
                    else if (capabilities.includes('data-analysis')) {
                        addMessageToPreview('user', 'Now analyze the weekday vs. weekend admission patterns as well.');
                        
                        setTimeout(() => {
                            addMessageToPreview('agent', "After analyzing weekday vs. weekend patterns, I found significant differences. Weekday admissions are 28% higher overall, with Monday showing the highest volume (32% above average). Weekend admissions show different diagnosis patterns, with emergency cases representing 46% of weekend admissions compared to 29% on weekdays. Would you like me to break this down by department as well?");
                            
                            // ORIENT stage for cycle 2
                            setTimeout(() => {
                                addSystemMessage("ORIENT: Analyzing updated performance...");
                                addSystemMessage("Performance analysis: Analysis completeness improved to 72%, insight relevance 68%");
                                
                                // DECIDE stage for cycle 2
                                setTimeout(() => {
                                    addSystemMessage("DECIDE: Strategy S2 shows improvement but can be enhanced. Adding multivariate correlation analysis (S3).");
                                    
                                    // ACT stage for cycle 2
                                    setTimeout(() => {
                                        addSystemMessage("ACT: Implementing strategy S3 (multivariate analysis with key driver identification)");
                                        updatePerformanceMetrics('72%', '35%', 'S3', '2');
                                        
                                        // Begin cycle 3
                                        runCycle3();
                                    }, 2000);
                                }, 2000);
                            }, 2000);
                        }, 1500);
                    }
                    else {
                        // Generic OODA simulation for other agent types
                        addMessageToPreview('user', 'Based on this information, what specific steps should I take next?');
                        
                        setTimeout(() => {
                            addMessageToPreview('agent', "Based on what you've shared, I recommend three specific steps: 1) First, focus on [specific action related to domain] because this addresses the immediate concern, 2) Then, implement [second specific action] which will help prevent similar issues, 3) Finally, consider [third action] to optimize outcomes in the long term. Would you like me to elaborate on any of these steps?");
                            
                            // ORIENT stage for cycle 2
                            setTimeout(() => {
                                addSystemMessage("ORIENT: Analyzing updated performance...");
                                addSystemMessage("Performance analysis: Response quality improved to 72%, specificity 71%");
                                
                                // DECIDE stage for cycle 2
                                setTimeout(() => {
                                    addSystemMessage("DECIDE: Strategy S2 shows improvement. Enhancing with personalized recommendations (S3).");
                                    
                                    // ACT stage for cycle 2
                                    setTimeout(() => {
                                        addSystemMessage("ACT: Implementing strategy S3 (context-aware personalized recommendations)");
                                        updatePerformanceMetrics('72%', '35%', 'S3', '2');
                                        
                                        // Begin cycle 3
                                        runCycle3();
                                    }, 2000);
                                }, 2000);
                            }, 2000);
                        }, 1500);
                    }
                }, 1500);
            }, 1000);
        }
        
        // CYCLE 3: Further improvement with second adaptation
        function runCycle3() {
            // Start cycle 3
            setTimeout(() => {
                updatePerformanceMetrics('85%', '60%', 'S3', '3');
                addSystemMessage("CYCLE 3: Testing enhanced strategy...");
                
                // User interaction with further improved agent
                setTimeout(() => {
                    if (capabilities.includes('medical-coding')) {
                        addMessageToPreview('user', 'Patient has COPD with acute exacerbation and pneumonia');
                        
                        setTimeout(() => {
                            addMessageToPreview('agent', "For this case, you should use J44.0 (COPD with acute lower respiratory infection) as the primary code, and J18.9 (Pneumonia, unspecified) as the secondary code. Since this is an acute exacerbation of COPD with pneumonia, these codes properly capture the relationship between the conditions. Also consider J44.1 for the acute exacerbation aspect if specifically documented. Based on common co-occurrences, you might also want to check if the patient has documented respiratory failure (J96.0) which is present in 28% of similar cases.");
                            
                            // Final ORIENT stage
                            setTimeout(() => {
                                addSystemMessage("ORIENT: Final performance analysis...");
                                addSystemMessage("Performance analysis: Code accuracy improved to 85%, throughput increased to 15 codes/min");
                                
                                // Final DECIDE stage
                                setTimeout(() => {
                                    addSystemMessage("DECIDE: Strategy S3 performs well. Making minor adjustments to presentation format.");
                                    
                                    // Final ACT stage
                                    setTimeout(() => {
                                        addSystemMessage("ACT: Optimization complete. Goal progress at 85%.");
                                        addSystemMessage("OODA Loop Simulation Complete: Agent successfully adapted to meet goal.");
                                        updatePerformanceMetrics('85%', '85%', 'S3+', '3');
                                    }, 2000);
                                }, 2000);
                            }, 2000);
                        }, 1500);
                    }
                    else if (capabilities.includes('data-analysis')) {
                        addMessageToPreview('user', 'What are the key drivers of our increasing readmission rates?');
                        
                        setTimeout(() => {
                            addMessageToPreview('agent', "Based on multivariate analysis of your data, the key drivers of increasing readmission rates are:\n\n1. Post-discharge follow-up timing: Patients seen >14 days after discharge have 2.8x higher readmission rates\n2. Medication reconciliation: 64% of readmissions had medication discrepancies\n3. Social determinants: Transportation barriers account for 31% of missed follow-ups\n4. Discharge during peak hospital occupancy (>85%) correlates with 23% higher readmission rates\n\nRecommendation: Focusing on the first two factors could reduce readmissions by approximately 42% based on historical patterns.");
                            
                            // Final ORIENT stage
                            setTimeout(() => {
                                addSystemMessage("ORIENT: Final performance analysis...");
                                addSystemMessage("Performance analysis: Analysis completeness 85%, insight actionability 89%");
                                
                                // Final DECIDE stage
                                setTimeout(() => {
                                    addSystemMessage("DECIDE: Strategy S3 performs well. Making minor adjustments to visualization priority.");
                                    
                                    // Final ACT stage
                                    setTimeout(() => {
                                        addSystemMessage("ACT: Optimization complete. Goal progress at 85%.");
                                        addSystemMessage("OODA Loop Simulation Complete: Agent successfully adapted to meet goal.");
                                        updatePerformanceMetrics('85%', '85%', 'S3+', '3');
                                    }, 2000);
                                }, 2000);
                            }, 2000);
                        }, 1500);
                    }
                    else {
                        // Generic OODA simulation for other agent types
                        addMessageToPreview('user', 'What's the most efficient approach for my situation?');
                        
                        setTimeout(() => {
                            addMessageToPreview('agent', "Based on your specific context and goals, the most efficient approach would be to implement a three-phase strategy: First, [detailed personalized recommendation 1] which addresses your immediate priorities of [specific detail from context]. Second, [detailed recommendation 2] that accounts for your resource constraints. Third, [detailed recommendation 3] which aligns with your long-term objectives. From similar scenarios I've analyzed, this approach typically results in 34% faster implementation and 28% better outcomes compared to standard methods.");
                            
                            // Final ORIENT stage
                            setTimeout(() => {
                                addSystemMessage("ORIENT: Final performance analysis...");
                                addSystemMessage("Performance analysis: Response quality 85%, personalization accuracy 87%");
                                
                                // Final DECIDE stage
                                setTimeout(() => {
                                    addSystemMessage("DECIDE: Strategy S3 performs well. Making minor adjustments to explanation depth.");
                                    
                                    // Final ACT stage
                                    setTimeout(() => {
                                        addSystemMessage("ACT: Optimization complete. Goal progress at 85%.");
                                        addSystemMessage("OODA Loop Simulation Complete: Agent successfully adapted to meet goal.");
                                        updatePerformanceMetrics('85%', '85%', 'S3+', '3');
                                    }, 2000);
                                }, 2000);
                            }, 2000);
                        }, 1500);
                    }
                }, 1500);
            }, 1000);
        }
    }

    function addMessageToPreview(type, content) {
        const agentPreview = document.getElementById('agentPreview');
        if (!agentPreview) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `preview-message ${type === 'user' ? 'user-message' : 'agent-message'}`;
        
        const icon = document.createElement('i');
        icon.className = type === 'user' ? 'bi bi-person-circle me-2' : 'bi bi-robot me-2';
        
        const span = document.createElement('span');
        span.textContent = type === 'user' ? 'You: ' : 'Agent: ';
        span.className = 'fw-bold';
        
        const contentSpan = document.createElement('span');
        contentSpan.textContent = content;
        
        messageDiv.appendChild(icon);
        messageDiv.appendChild(span);
        messageDiv.appendChild(contentSpan);
        
        agentPreview.appendChild(messageDiv);
        
        // Scroll to bottom
        agentPreview.scrollTop = agentPreview.scrollHeight;
    }

    // Helper function to add system messages (for OODA loop simulation)
    function addSystemMessage(message) {
        const agentPreview = document.getElementById('agentPreview');
        if (!agentPreview) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `preview-message system-message`;
        messageDiv.style.backgroundColor = '#f0f0f0';
        messageDiv.style.borderLeft = '3px solid #6c757d';
        messageDiv.style.color = '#6c757d';
        messageDiv.style.fontSize = '0.85em';
        messageDiv.style.padding = '0.5rem';
        messageDiv.style.marginBottom = '0.5rem';
        
        const icon = document.createElement('i');
        icon.className = 'bi bi-gear-fill me-2';
        
        const contentSpan = document.createElement('span');
        contentSpan.textContent = message;
        
        messageDiv.appendChild(icon);
        messageDiv.appendChild(contentSpan);
        
        agentPreview.appendChild(messageDiv);
        
        // Scroll to bottom
        agentPreview.scrollTop = agentPreview.scrollHeight;
    }
    
    // Helper function to update OODA metrics
    function updatePerformanceMetrics(performance, progress, strategy, cycle) {
        console.log("Updating metrics:", performance, progress, strategy, cycle);
        const performanceMetric = document.getElementById('performanceMetric');
        const goalProgress = document.getElementById('goalProgress');
        const goalProgressBar = document.getElementById('goalProgressBar');
        const currentStrategy = document.getElementById('currentStrategy');
        const adaptationCycle = document.getElementById('adaptationCycle');
        
        if (performanceMetric) performanceMetric.textContent = performance;
        if (goalProgress) goalProgress.textContent = progress;
        if (goalProgressBar) {
            goalProgressBar.style.width = progress;
            goalProgressBar.setAttribute('aria-valuenow', parseInt(progress));
        }
        if (currentStrategy) currentStrategy.textContent = strategy;
        if (adaptationCycle) adaptationCycle.textContent = cycle;
    }

    // Copy YAML button
    const copyYamlBtn = document.getElementById('copyYaml');
    if (copyYamlBtn) {
        copyYamlBtn.addEventListener('click', () => {
            const yamlText = document.getElementById('yamlOutput').textContent;
            navigator.clipboard.writeText(yamlText).then(() => {
                // Show copy success message
                const originalText = copyYamlBtn.textContent;
                copyYamlBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyYamlBtn.textContent = originalText;
                }, 2000);
            });
        });
    }

    // Download YAML button
    const downloadYamlBtn = document.getElementById('downloadYaml');
    if (downloadYamlBtn) {
        downloadYamlBtn.addEventListener('click', () => {
            const yamlText = document.getElementById('yamlOutput').textContent;
            const agentName = document.getElementById('agentName').value || 'custom-agent';
            const fileName = generateSlug(agentName) + '.yaml';
            
            const blob = new Blob([yamlText], { type: 'text/yaml' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
    
    // Function to add a new metric item
    function addMetricItem() {
        const metricsDynamicSection = document.getElementById('metricsDynamicSection');
        if (!metricsDynamicSection) return;
        
        const newItem = document.createElement('div');
        newItem.className = 'metric-item mb-2';
        newItem.innerHTML = `
            <div class="input-group">
                <input type="text" class="form-control" placeholder="Metric name" aria-label="Metric name">
                <select class="form-select" style="max-width: 150px;">
                    <option selected>Type</option>
                    <option value="percentage">Percentage</option>
                    <option value="count">Count</option>
                    <option value="time">Time (ms)</option>
                    <option value="boolean">Boolean</option>
                    <option value="score">Score (0-1)</option>
                </select>
                <button class="btn btn-outline-secondary remove-metric-btn" type="button">
                    <i class="bi bi-dash"></i>
                </button>
            </div>
        `;
        
        metricsDynamicSection.appendChild(newItem);
        
        // Add event listener to the new remove button
        const removeBtn = newItem.querySelector('.remove-metric-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                metricsDynamicSection.removeChild(newItem);
            });
        }
    }
    
    // Initialize remove buttons for existing metrics
    function initMetricRemoveButtons() {
        const removeButtons = document.querySelectorAll('.remove-metric-btn');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const metricItem = this.closest('.metric-item');
                metricItem.parentNode.removeChild(metricItem);
            });
        });
    }
    
    // Add a predefined metric with name and type
    function addPredefinedMetric(name, type) {
        const metricsDynamicSection = document.getElementById('metricsDynamicSection');
        if (!metricsDynamicSection) return;
        
        const newItem = document.createElement('div');
        newItem.className = 'metric-item mb-2';
        newItem.innerHTML = `
            <div class="input-group">
                <input type="text" class="form-control" value="${name}" aria-label="Metric name">
                <select class="form-select" style="max-width: 150px;">
                    <option ${type === 'Type' ? 'selected' : ''}>Type</option>
                    <option ${type === 'percentage' ? 'selected' : ''} value="percentage">Percentage</option>
                    <option ${type === 'count' ? 'selected' : ''} value="count">Count</option>
                    <option ${type === 'time' ? 'selected' : ''} value="time">Time (ms)</option>
                    <option ${type === 'boolean' ? 'selected' : ''} value="boolean">Boolean</option>
                    <option ${type === 'score' ? 'selected' : ''} value="score">Score (0-1)</option>
                </select>
                <button class="btn btn-outline-secondary remove-metric-btn" type="button">
                    <i class="bi bi-dash"></i>
                </button>
            </div>
        `;
        
        metricsDynamicSection.appendChild(newItem);
        
        // Add event listener to the new remove button
        const removeBtn = newItem.querySelector('.remove-metric-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                metricsDynamicSection.removeChild(newItem);
            });
        }
    }
    
    function generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\\w ]+/g, '')
            .replace(/ +/g, '-');
    }
    
    // Function to set up template selection
    function setupTemplateSelection() {
        console.log("Setting up template selection handler");
        
        // Direct click handler for each template
        document.getElementById('medical-coding-template').addEventListener('click', function() {
            selectTemplate('medical-coding');
        });
        
        document.getElementById('data-analysis-template').addEventListener('click', function() {
            selectTemplate('data-analysis');
        });
        
        document.getElementById('customer-support-template').addEventListener('click', function() {
            selectTemplate('customer-support');
        });
        
        document.getElementById('blank-template').addEventListener('click', function() {
            selectTemplate('blank');
        });
    }
    
    // Function to handle template selection
    function selectTemplate(templateId) {
        console.log(`Selecting template: ${templateId}`);
        
        // Clear selection from all templates
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('border-primary');
        });
        
        // Add border to selected template
        const selectedCard = document.querySelector(`.template-card[data-template-id="${templateId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('border-primary');
        }
        
        // Set selected template value
        const selectedTemplateInput = document.getElementById('selectedTemplate');
        if (selectedTemplateInput) {
            selectedTemplateInput.value = templateId;
        }
        
        // Enable continue button
        const nextBtn = document.querySelector('.template-next-btn');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
        
        // Preload template data
        preloadTemplateData(templateId);
    }
});