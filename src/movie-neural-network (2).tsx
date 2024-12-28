import React, {useState, useEffect} from 'react';
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Slider} from '@/components/ui/slider';
import {Heart, Swords} from 'lucide-react';

const MovieNeuralNetwork = () => {
  const [inputs, setInputs] = useState([0.5, 0.5]); // [action, romance]
  const [weights1, setWeights1] = useState([
    [0.6, -0.3],
    [-0.2, 0.8],
  ]);
  const [weights2, setWeights2] = useState([0.7, 0.6]);
  const [hiddenLayer, setHiddenLayer] = useState([0, 0]);
  const [output, setOutput] = useState(0);
  const [currentProfile, setCurrentProfile] = useState(null);

  // Profils de spectateurs recalibrés
  const viewerProfiles = [
    {
      name: "Fan d'Action",
      description: "Adore les films d'action, rejette la romance",
      weights1: [
        [0.9, -0.8],
        [-0.7, 0.2],
      ],
      weights2: [0.9, 0.1],
      icon: '🎬',
    },
    {
      name: 'Romantique',
      description: "Passionné par les histoires d'amour",
      weights1: [
        [-0.8, 0.9],
        [-0.7, 0.9],
      ],
      weights2: [0.1, 0.9],
      icon: '💝',
    },
    {
      name: 'Équilibré',
      description: 'Apprécie un bon mélange des genres',
      weights1: [
        [0.7, 0.6],
        [0.6, 0.7],
      ],
      weights2: [0.5, 0.5],
      icon: '⭐',
    },
    {
      name: 'Critique Exigeant',
      description: 'Demande un haut niveau dans les deux aspects',
      weights1: [
        [0.9, 0.8],
        [0.8, 0.9],
      ],
      weights2: [0.9, 0.9],
      icon: '🎭',
    },
  ];

  const movieExamples = [
    {
      name: 'Fast & Furious',
      action: 0.9,
      romance: 0.2,
      icon: '🏎️',
      description: 'Action pure',
    },
    {
      name: 'Titanic',
      action: 0.3,
      romance: 0.9,
      icon: '🚢',
      description: 'Romance classique',
    },
    {
      name: 'Mr. & Mrs. Smith',
      action: 0.7,
      romance: 0.7,
      icon: '🔫',
      description: 'Équilibré',
    },
    {
      name: 'Notebook',
      action: 0.1,
      romance: 1.0,
      icon: '📓',
      description: 'Romance pure',
    },
    {
      name: 'Die Hard',
      action: 1.0,
      romance: 0.1,
      icon: '💥',
      description: 'Action pure',
    },
  ];

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));

  const forwardPass = () => {
    const hidden = weights1.map((neuronWeights) => {
      const sum = neuronWeights[0] * inputs[0] + neuronWeights[1] * inputs[1];
      const factor = sum < 0 ? 5 : 3;
      return sigmoid(sum * factor);
    });
    setHiddenLayer(hidden);

    const outputSum = hidden[0] * weights2[0] + hidden[1] * weights2[1];
    const outputFactor = outputSum < 0 ? 5 : 3;
    const outputValue = sigmoid(outputSum * outputFactor);
    setOutput(outputValue);
  };

  const setMovieExample = (movie) => {
    setInputs([movie.action, movie.romance]);
  };

  const setProfile = (profile) => {
    setCurrentProfile(profile);
    setWeights1(profile.weights1);
    setWeights2(profile.weights2);
  };

  useEffect(() => {
    forwardPass();
  }, [inputs, weights1, weights2]);

  const getNeuronColor = (value) => {
    const intensity = Math.floor(value * 255);
    return `rgb(${intensity}, ${intensity}, 255)`;
  };

  const getRecommendationText = (score) => {
    if (score > 0.8) return 'Va adorer! 🤩';
    if (score > 0.6) return 'Devrait bien aimer 😊';
    if (score > 0.4) return 'Pourrait apprécier 🤔';
    if (score > 0.2) return 'Risque de ne pas aimer 😕';
    return "N'aimera probablement pas 😬";
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Prédiction - Goûts Cinématographiques</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profils de spectateurs */}
        <div className="space-y-2">
          <h3 className="font-medium">Profils de spectateurs :</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {viewerProfiles.map((profile) => (
              <Button
                key={profile.name}
                variant={
                  currentProfile?.name === profile.name ? 'default' : 'outline'
                }
                onClick={() => setProfile(profile)}
                className="h-auto py-2 flex flex-col items-center gap-1"
              >
                <span className="text-xl">{profile.icon}</span>
                <span className="text-sm font-medium">{profile.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Films exemples */}
        <div className="space-y-2">
          <h3 className="font-medium">Films exemple :</h3>
          <div className="flex flex-wrap gap-2">
            {movieExamples.map((movie) => (
              <Button
                key={movie.name}
                variant="outline"
                onClick={() => setMovieExample(movie)}
                className="text-sm"
              >
                {movie.icon} {movie.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Contrôles des entrées */}
        <div className="space-y-4">
          <h3 className="font-medium">Caractéristiques du film :</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <Swords className="w-4 h-4" />
                Action: {inputs[0].toFixed(2)}
              </label>
              <Slider
                value={[inputs[0]]}
                onValueChange={([value]) => {
                  setInputs([value, inputs[1]]);
                }}
                max={1}
                step={0.01}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Romance: {inputs[1].toFixed(2)}
              </label>
              <Slider
                value={[inputs[1]]}
                onValueChange={([value]) => {
                  setInputs([inputs[0], value]);
                }}
                max={1}
                step={0.01}
              />
            </div>
          </div>
        </div>

        {/* Visualisation du réseau */}
        <div className="relative h-96 border rounded-lg p-4">
          {/* Couche d'entrée */}
          <div className="absolute left-10 top-1/2 transform -translate-y-1/2 space-y-8">
            {inputs.map((input, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center text-xs"
                style={{backgroundColor: getNeuronColor(input)}}
              >
                {i === 0 ? (
                  <Swords className="w-6 h-6" />
                ) : (
                  <Heart className="w-6 h-6" />
                )}
                {input.toFixed(2)}
              </div>
            ))}
          </div>

          {/* Connexions vers la couche cachée */}
          <svg className="absolute left-28 top-0 w-32 h-full pointer-events-none">
            {inputs.map((_, i) =>
              hiddenLayer.map((_, j) => (
                <line
                  key={`${i}-${j}`}
                  x1="0"
                  y1={i === 0 ? '35%' : '65%'}
                  x2="100%"
                  y2={j === 0 ? '35%' : '65%'}
                  stroke={weights1[j][i] > 0 ? 'blue' : 'red'}
                  strokeWidth={Math.abs(weights1[j][i]) * 3}
                  opacity="0.5"
                />
              ))
            )}
          </svg>

          {/* Couche cachée */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 space-y-8">
            {hiddenLayer.map((value, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-xs text-center"
                style={{backgroundColor: getNeuronColor(value)}}
              >
                {i === 0 ? 'Préf. Action' : 'Préf. Romance'}
                <br />
                {value.toFixed(2)}
              </div>
            ))}
          </div>

          {/* Connexions vers la sortie */}
          <svg className="absolute right-28 top-0 w-32 h-full pointer-events-none">
            {hiddenLayer.map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={i === 0 ? '35%' : '65%'}
                x2="100%"
                y2="50%"
                stroke={weights2[i] > 0 ? 'blue' : 'red'}
                strokeWidth={Math.abs(weights2[i]) * 3}
                opacity="0.5"
              />
            ))}
          </svg>

          {/* Couche de sortie */}
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <div
              className="w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center text-xs"
              style={{backgroundColor: getNeuronColor(output)}}
            >
              Appréciation
              <br />
              {output.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Prédiction */}
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <h3 className="font-medium text-lg">
            Prédiction : {getRecommendationText(output)}
          </h3>
          <p className="text-sm text-gray-600">
            Score d'appréciation : {(output * 100).toFixed(1)}%
          </p>
          {currentProfile && (
            <p className="text-sm text-gray-600 mt-1">
              Profil actuel : {currentProfile.icon} {currentProfile.name}
            </p>
          )}
        </div>

        {/* Légende */}
        <div className="space-y-2 text-sm">
          <p>
            • Les connexions bleues augmentent le score, les rouges le diminuent
          </p>
          <p>
            • Plus la couleur d'un neurone est intense, plus son activation est
            forte
          </p>
          <p>
            • Les neurones cachés représentent les préférences apprises pour
            chaque genre
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieNeuralNetwork;
