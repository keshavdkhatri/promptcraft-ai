from flask import Flask
from flask_cors import CORS

from config.settings import FLASK_DEBUG, FLASK_HOST, FLASK_PORT
from routes.optimize_routes import optimize_bp
from routes.prompt_routes import prompt_bp


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)

    # Allow frontend requests during local development
    CORS(app)

    # Register API routes
    app.register_blueprint(prompt_bp)
    app.register_blueprint(optimize_bp)

    @app.route("/")
    def health_check():
        return {
            "success": True,
            "message": "PromptCraft AI backend is running.",
        }

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host=FLASK_HOST, port=FLASK_PORT, debug=FLASK_DEBUG)
