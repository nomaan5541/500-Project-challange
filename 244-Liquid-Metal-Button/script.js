import {
  liquidMetalFragmentShader,
  ShaderMount
} from "https://esm.sh/@paper-design/shaders";

const container = document.getElementById("liquid-metal");

new ShaderMount(
  container,
  liquidMetalFragmentShader,
  {
    u_repetition: 1.5,
    u_softness: 0.5,
    u_shiftRed: 0.3,
    u_shiftBlue: 0.3,
    u_distortion: 0,
    u_contour: 0,
    u_angle: 100,
    u_scale: 1.5,
    u_shape: 1,
    u_offsetX: 0.1,
    u_offsetY: -0.1
  },
  undefined,
  0.6
);