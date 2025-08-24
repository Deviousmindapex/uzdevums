#!/bin/bash
# ML Training Pipeline Setup Script

echo "Setting up ML Training Pipeline..."
echo "================================="

# Check if Python3 is available
if ! command -v python3 &> /dev/null; then
    echo "Error: Python3 is not installed!"
    exit 1
fi

echo "Python3 version: $(python3 --version)"

# Install requirements if file exists
if [ -f "requirements.txt" ]; then
    echo "Installing Python dependencies..."
    python3 -m pip install --user -r requirements.txt
    if [ $? -eq 0 ]; then
        echo "Dependencies installed successfully!"
    else
        echo "Warning: Some dependencies might not have installed. The pipeline will use fallback options."
    fi
else
    echo "No requirements.txt found. Pipeline will run with basic functionality."
fi

echo ""
echo "Setup complete! You can now run the ML training pipeline with:"
echo "  python3 ml_training_pipeline.py"
echo ""
echo "Output files:"
echo "  - training_logs_2025.log (detailed logs)"
echo "  - trained_model_2025.json (trained model data)"